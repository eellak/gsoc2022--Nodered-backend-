var User = require("../models/user");
var config = require("../config.js");
var Docker = require('dockerode');
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
 const id ={} ;
  const docker = new Docker({
    host:'http://localhost',
    port: id.port||6969,//betterway, options inside create container
    });
    docker.createContainer({
      HostConfig:{
      PortBindings:{
        "6969/tcp":[{HostPort:"6969"}]
      }
    },
      Image:'nodered/node-red',
      Cmd:['/bin/bash'], 
      name: 'cont2.0'}, function(err, container){
      container.start(function(err,data){
        //
      });
    });
    res.data={port:port};
};
//save or discard
stop = (req,res) => {
  //save,discard
  //stop
}
cloneInstances = (req,res) => {
//LOOP-1>looping through flows and adding them to containers via cp command
//LOOP-2>installing npm node modules inside container
}
module.exports = {dashboard, userLogout};