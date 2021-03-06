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
const { nextTick } = require("node:process");


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
createFresh = (req,res,next) => {
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
    return container.start().then(()=>{
      next();
    })
    //about err
  });
  // res.data={port:port};
  // next();
  // res.send({
  //   success:true,msg:"successful"
  // });
});
};

//save or discard
const publicpath="./neu";
stopContainer = (req,res) => {
  //save,discard
  const annotation = req.body.annotation;
  const username = res.locals.username;
  const email = res.locals.email;
  // User.findOne({email:email},function(err,user){

    let errors = [];
    
    if(annotation){
    const InstancePath=`../data/${username}/${annotation}`;
    
    // check in db for similar name and store in existing;
  const existing = fs.existsSync(`${InstancePath}`);
  // if(existing)//&&!req.locals.edit)
  // return res.send({success:false,msg:"overwrite warning"});//EDIT
  if(!existing)
  {
  fs.mkdirSync(`${InstancePath}`);
  User.findOneAndUpdate({email:email},{$push:
    {
    instances:{
      annotation:annotation,
      accessibility:"public",
    }
    }})//anything better?
  
  .exec((err,user)=>{
      if(err)console.log(err);
      // else
      // console.log("done");//to be completed
    });  
  }
    
  
  //Saving flows
  exec(`docker cp ${username}:"../data/flows.json" "${InstancePath}"`,(err)=>{
    if(err)console.log(err);
    else if(!res.locals.edit){
        //Editing flows
  let rawdata = fs.readFileSync(`${InstancePath}/flows.json`);
  let newflow = JSON.parse(rawdata);//console.log(newflow);
  newflow.forEach((element,index) =>{
    if(element.type === "tab"){
      newflow[index].label=annotation+"-"+newflow[index].label;
    }
  });
  fs.writeFileSync(`${InstancePath}/flows.json`,JSON.stringify(newflow),(err)=> console.log(err));
    }
  });
  


  //Saving nodes
  exec(`docker cp ${username}:"../data/package.json" "${InstancePath}"`,(err)=>{
    if(err)console.log(err);
    else{
      let rawdata = fs.readFileSync(`${InstancePath}/package.json`);
      let nodes=[];
      rawdata= JSON.parse(rawdata);
      if(rawdata.dependencies){
      let dependencies = rawdata.dependencies;
      for(let i in dependencies)nodes.push(i);
      }
      fs.writeFileSync(`${InstancePath}/nodes.json`,JSON.stringify(nodes),function(err){
        if(err)console.log(err);
      });
      fs.unlinkSync(`${InstancePath}/package.json`,function(err){
        if(err)console.log(err);
      });
      
    }
  });
}

//kill container
const container = docker.getContainer(username);
container.remove({force: true},function(err){
  if(err)console.log(err);
});
res.send({success:true});

// });
};

cloneInstances = (req,res) => {
const cont = res.locals.username;
const username = res.locals.username;
let annotations = req.body.selections;//[{username:xxx,annotation:yyy}]

let newflow=[];
let newnode=[];
console.log(annotations);

//Loop for accumulating flows and nodes
let c=0;
for(let i=0;i<annotations.length;i++){
let rawdata = fs.readFileSync(`../data/${annotations[i].username}/${annotations[i].annotation}/flows.json`);
const flow = JSON.parse(rawdata);

rawdata = fs.readFileSync(`../data/${annotations[i].username}/${annotations[i].annotation}/nodes.json`);
const node = JSON.parse(rawdata);

for(let j=0;j<flow.length;j++){
  flow[j].id+=`${c++}`;
  newflow.push(flow[j]);
}
for(let j=0;j<node.length;j++){
  newnode.push(node[j]);
}
}

let userpath = `../data/${username}/flows.json`;
fs.writeFileSync(userpath, JSON.stringify(newflow))

exec(`docker cp "${userpath}" ${cont}:"../data/flows.json"`,(err)=>{
    if(err)console.log(err);
    fs.unlink(userpath,err=>console.log(err));
  });

// fs.writeFileSync(userpath, JSON.stringify(newnode), (err) => console.log(err));
// let rawdata = fs.readFileSync(userpath);
// const dependencies = JSON.parse(rawdata);

//LOOP-2>installing npm node modules inside container
for(let i=0;i<newnode.length;i++){
  execSync(`docker exec -d --workdir //data/ ${cont} npm install ${node[i]}`);
  }
  //restarting the container to get the additions working
  docker.getContainer({cont},(err, container)=>{
      container.restart((err)=>console.log(err)).then((err)=>{ //problem ?
      if(err)console.log(err);
      else
      res.send({success:true,msg:"send port/url"});
    });
  });
    
};

availableInstances= (req,res)=>{
const email = res.locals.email;
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