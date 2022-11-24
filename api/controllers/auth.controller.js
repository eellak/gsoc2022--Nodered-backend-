const {getPort}= require('get-port-please');
var bodyparser = require("body-parser");
var config = require("../config.js");
var { verifySignUp } = require("../middlewares");
var {exec} = require('node:child_process');


var jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    User = require("../models/user"),
    Ports = require("../models/port");


try{
exports.userRegister = async function (req,res,next){
  if(
        req.body &&
        req.body.email){
          let exists=false;
          const email=req.body.email;
          let username="";
          let i=0;
          while(i<email.length){
            if(email[i] === '@'){
              username+='A';
            }
            else if(email[i] === '.'){
              username+='D';
            }
            else username+=email[i];
            i++;
          }
           User.find({email:req.body.email},(err,docs)=>{
            if(err)console.log(err);
            else if(docs.length){
              exists=true;
            }
            if(exists){
              next();
              return;
            }
            let curPort;
           User.findOne({email:"ports"},(err,foundUser)=>{
                if(err)console.log(err);
                curPort=foundUser.port;
                curPort=parseInt(curPort,10);
                getPort({port:curPort,portRange:[curPort,10000]}).then(port => {
                  curPort=port;
                  const user = new User({
                    email: req.body.email,
                    toc: "",
                    port: curPort,
                    username:username
              });
              curPort++;
              User.findOneAndUpdate({email:"ports"},{port:curPort},(err,foundUser)=>{
                if(err)console.log(err);
                user.save((err, user) => {
                  if(err){
                    console.log(err);
                    res.send({success:false,message:"Please try again"});
                    return;
                  }
                  // console.log(user.username);
                  exec(`mkdir "../data/${user.username}"`,err => console.log(err));
                  next();
                });
              });
            });
            });
        });
          
        }
        else
        res.send({success:false,message:"Form not filled!"});
    
};
}catch(err){console.log(err);}
exports.userLogin = function (req,res){
    if(req.body &&
      req.body.email){
             
        User.findOne({email: req.body.email}, function(err,foundUser){
          if(err) {
            return res.send({message: err});
          } else {
            if(foundUser) {
              // if(!foundUser.comparePassword(req.body.password)){
              //   return res.status(401).json({message: 'Wrong Password'});                
              // }
              
              const date = new Date();
              foundUser.toc = date.toString();
              foundUser.save(function(err,user){
                if(err){return res.send({success: false, message:"Error while saving doc"})}
              });
              // console.log(foundUser.toc);
              const user = {
                email: foundUser.email,
                toc: date.toString(),    //time of creation
              };
              var token = jwt.sign({ data: user}, config.secret,{
                expiresIn: 1000*60*60*24,
              });
              if(!res.headersSent){

                res.status(200).json({
                  //   id: user._id, //huh??
                  headers:{
                    authorization:token
                  }
                });
              }
            }
            else
            {return res.send("User not found");}
          }
        });

      }
      else
      {return res.send("fill it up");}
};

