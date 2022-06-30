var User = require("../models/user");
var config = require("../config.js");
const {exec} = require('node:child_process');
const fs = require('fs');
var Docker = require('dockerode');
const docker = new Docker({
  host:'http://localhost',
  port: 2375,//betterway, options inside create container
  });
const { response } = require("../app");


dashboard = function(req,res){

    User.findOne({
        email: res.locals.email,
    }).exec((err,user) => {
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
 const email =req.locals.email;
 var port;
 User.findOne({email:email}).then(function(err,user){
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
  name: 'contfafa.0'
  ,
  ExposedPorts: {
     "1880/tcp": {}
   }
 }
  ).then(function(container){
     return container.start();//about err
  });
    res.data={port:port};
};
//save or discard

stop = (req,res) => {
  //save,discard
  const cont = req.locals.cont;
  const userpath="./neu";
  exec(`docker cp ${cont}:"./data/flows.json" "${userpath}"`);
  exec(`docker cp ${cont}:"./data/package.json" "${userpath}"`);
  
  //stop
  
}
const publicpath="./neu";
cloneInstances = (req,res) => {
const userpath="./neu";
const cont = req.locals.cont;
let annotations = [];
const floarray=[];
const dependencies=[];
var newflow={};
//LOOP-1>looping through flows and adding them to containers via cp command
for(let i=0;i<floarray.length;i++){
let rawdata = fs.readFileSync('./neu/flows.json');
let flow = JSON.parse(rawdata);
Object.assign(newflow,flow);
}
//LOOP-2>installing npm node modules inside container
for(let i=0;i<dependencies.length;i++){
  exec(`docker exec -d --workdir //data/ ${cont} npm install ${dependencies[i]}`,function(err){
    console.log(err);
  });// then
}

}
module.exports = {dashboard, userLogout};