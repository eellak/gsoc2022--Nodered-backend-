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
 const email =res.locals.email;
 User.findOne({email:email},function(err,user){
  if(err) return res.send("mongoerror");
  const port = user.port;
 const username = user.username;
 //.catch(err => console.log(err)).finally(() => res.send({msg:"mongo error"}));
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
});
};

//save or discard
const publicpath="./neu";
stopContainer = (req,res) => {
  //save,discard
  const annotation = req.body.annotation;
  const username = res.locals.username;
  const email = res.locals.email;
  User.findOne({email:email},function(err,user){

    let errors = [];
    
    if(annotation){
    const InstancePath=`./data/${username}/${annotation}`;
    
    // check in db for similar name and store in existing;
  const existing = fs.existsSync(`${InstancePath}`);
  if(existing)//&&!req.locals.edit)
  return res.send({success:false,msg:"overwrite warning"});//EDIT
  if(!existing)
  {
    
    
    fs.mkdirSync(`${InstancePath}`);
  
  //Saving flows
  execSync(`docker cp ${username}:"./data/flows.json" "${InstancePath}"`);
  
  //Editing flows
  let rawdata = fs.readFileSync(`${InstancePath}/flows.json`);
  let newflow = JSON.parse(rawdata);
  newflow.foreach((element,index) =>{
    if(element.type === "tab"){
      newflow[index].label=annotation+"-"+newflow[index].label;
    }
  });
  fs.writeFileSync(`${InstancePath}/flows.json`,JSON.stringify(newflow),(err)=> console.log(err));

  //Saving nodes
  execSync(`docker cp ${username}:"./data/package.json" "${InstancePath}"`);

    rawdata = fs.readFileSync(`${InstancePath}/package.json`);
    let dependencies = JSON.parse(rawdata).dependencies;
    fs.writeFileSync(`${InstancePath}/nodes.json`,JSON.stringify(dependencies),function(err){
      if(err)console.log(err);
    });
    fs.unlinkSync(`${InstancePath}/package.json`,function(err){
      if(err)console.log(err);
    });
    
  
  User.findOneAndUpdate({email:email},{$push:{
    instances:{
      annotation:annotation,
      accessibility:req.locals.accessibility||"public",
    }
  }});//anything better?
  
  // .exec((err,user)=>{
    //   if(err)console.log(err);
    //   else
    //   res.send({success:true});//to be completed
    // });

    
}
  
}

//kill container
const container = docker.getContainer(username);
container.remove({force: true},function(err){
  if(err)console.log(err);
});


});
};

cloneInstances = (req,res) => {
const cont = res.locals.username;
let annotations = req.body.selections;//[{username:xxx,annotation:yyy}]

let newflow={};
let newnode={};
//Loop for accumulating flows and nodes
for(let i in annotations){
let rawdata = fs.readFileSync(`./data/${annotations[i].username}/${annotations[i].annotation}/flows.json`);
const flow = JSON.parse(rawdata);

rawdata = fs.readFileSync(`./data/${annotations[i].username}/${annotations[i].annotation}/nodes.json`);
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
  container.restart((err)=>console.log(err)).then((err)=>{ //problem ?
    if(err)console.log(err);
    else
    res.send({success:true,msg:"send port/url"});
  });

};

availableInstances= (req,res)=>{
const email = req.locals.email;
User.find({email:{$ne:email}},{instances:1,_id:0},(err,docs)=>{
if(err)console.log("db error");
else{
  let instances=[];
  docs[instances].forEach(element => {
    if(element.accessibility === "public"){
      instances.push({username:docs[username],annotation:element[annotation]});
    }
  });
  res.json(instances);
}
}); //null's required only when its coming in the middle

};

module.exports = {dashboard, userLogout,createFresh,stopContainer,cloneInstances,availableInstances};