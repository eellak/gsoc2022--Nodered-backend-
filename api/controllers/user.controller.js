var User = require("../models/user");
var config = require("../config.js");
const {exec,execSync} = require('node:child_process');
const fs = require('fs');
var Docker = require('dockerode');
const docker = new Docker({
  host:'http://localhost',
  port: 2375,//betterway, options inside create container
  });
const { response } = require("../app");
const { emitKeypressEvents } = require("node:readline");


dashboard = function(req,res){

    User.findOne({
        email: res.locals.email,
    }).execSync((err,user) => {
        if(err){
            return res.status(400).send({
                success: false,
                message: "Unable to connect to database.",
                error: err,
            });
        }
        if(!user){
            return res.status(400).send({
                success: false,
                message: "User not found"
            });
        }

        res.send({
            success:true, 
            message:"Successfully Authorized!", 
            accessToken:res.locals.token, 
            email:res.locals.email
        });
    });
};
userLogout = (req, res) => {
  
      User.findOne({email: res.locals.email}, function(err,foundUser){
        if(err) {
          return res.send({message: err});
        } else {
          if(foundUser) {
          
            
            const date = config.logout_toc;
            foundUser.toc = date.toString();
            foundUser.save(function(err,user){
              if(err){return res.send({success: false, message:"Error while saving doc"})}
            });
    
         
            if(!res.headersSent){
              res.status(200).send({
                success:true,
                message:"Successfully logged out"
              });
            }
          }
          else
          {return res.send("User not found");}
        }
      });
    
    };
//current
//create
createFresh = (req,res) => {
 const username =req.locals.username;
 let port;
 User.findOne({username:username}).then(function(err,user){
 port = user.port;
 });
  
 docker.createContainer({
  HostConfig:{
  PortBindings:{
    "1880/tcp":[{HostPort:port}]//variable ports
  }
},
  Image:'nodered/node-red',
  Cmd:['/bin/bash'],
  name: `${username}`
  ,
  ExposedPorts: {
     "1880/tcp": {}
   }
 }
  ).then(function(container){
     return container.start();//about err
  });
    res.data={port:port};
    res.send({
      success:true,msg:"successful"
    });
};

//save or discard
const publicpath="./neu";
stop = (req,res) => {
  //save,discard
  const cont = req.locals.username;
  let errors = [];
  
  if(req.locals.annotation){
    const InstancePath=`./${req.locals.username}/${req.locals.annotation}`;
    
    // check in db for similar name and store in existing;
  const existing = fs.existsSync(`${InstancePath}`);
  if(existing&&!req.locals.edit)
  return res.send({success:false,msg:"overwrite warning"});
  if(!existing){
    fs.mkdirSync(`${InstancePath}`,(err) => console.log(err));
     
  }

  // Saving flows
  execSync(`docker cp ${cont}:"./data/flows.json" "${InstancePath}"`);
  
  //Saving nodes
  execSync(`docker cp ${cont}:"./data/package.json" "${InstancePath}"`);
  let rawdata = fs.readFileSync(`${InstancePath}/package.json`);
  let dependencies = JSON.parse(rawdata).dependencies;
  fs.writeFileSync(`${InstancePath}/nodes.json`,JSON.stringify(dependencies),function(err){
    if(err)console.log(err);
  });
  fs.unlinkSync(`${InstancePath}/package.json`,function(err){
    if(err)console.log(err);
  });

  User.findOneAndUpdate({username:cont},{$push:{
    instances:{
      annotation:req.locals.annotation,
      accessibility:req.locals.accessibility
    }
  }}).execSync((err,user)=>{
    if(err)console.log(err);
    else
    res.send({success:true});//to be completed
  });

}

  //kill container
  const container = docker.getContainer(cont);
  container.remove({force: true},function(err){
    if(err)console.log(err);
  });
};

cloneInstances = (req,res) => {
const cont = req.locals.username;
let annotations = req.locals.annotations;//[{username:xxx,annotation:yyy}]

let newflow={};
let newnode={};
//Loop for accumulating flows and nodes
for(let i in annotations){
let rawdata = fs.readFileSync(`./${annotations[i].username}/${annotations[i].annotation}/flows.json`);
const flow = JSON.parse(rawdata);

rawdata = fs.readFileSync(`./${annotations[i].username}/${annotations[i].annotation}/nodes.json`);
const node = JSON.parse(rawdata);

Object.assign(newflow,flow);
Object.assign(newnode,node);
}

let userpath = `./${username}/temporary.json`;

fs.writeFileSync(userpath, JSON.stringify(newflow), (err) => console.log(err));
execSync(`docker cp "${userpath}" ${cont}:"./data/flows.json"`);

// fs.writeFileSync(userpath, JSON.stringify(newnode), (err) => console.log(err));
// let rawdata = fs.readFileSync(userpath);
// const dependencies = JSON.parse(rawdata);
fs.unlinkSync(userpath,(err)=>console.log(err));

//LOOP-2>installing npm node modules inside container
for(let i in newnode){
  execSync(`docker exec -d --workdir //data/ ${cont} npm install ${i}`,function(err){
    console.log(err);
  });
  };
  //restarting the container to get the additions working
  const container = docker.getContainer({cont});
  container.restart((err)=>console.log(err)).then((err)=>{
    if(err)console.log(err);
    else
    res.send({success:true,msg:"send port/url"});
  });

};

module.exports = {dashboard, userLogout};