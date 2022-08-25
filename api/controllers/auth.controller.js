var bodyparser = require("body-parser");
var config = require("../config.js");
var { verifySignUp } = require("../middlewares");
var {exec} = require('node:child_process');


var jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    User = require("../models/user");

const TOKEN_EXPIRATION = 1000 * 60 * 60 * 24

exports.userRegister = function (req,res,next){
  console.log(req);
  if(
        req.body &&
        req.body.email &&
        req.body.password){
          const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password,10),
            toc: "",
            port: req.body.port,
            username: req.body.username
          });
         user.save((err, user) => {
          if(err)console.log(err);
          exec(`mkdir "./data/${req.body.username}"`,err => console.log(err));
           next();
         });

        }
        else
        res.send({success:false,message:"Form not filled!"});
    
};

exports.userLogin = function (req,res){
    if(req.body &&
      req.body.email &&
      req.body.password){
             
        User.findOne({email: req.body.email}, function(err,foundUser){
          if(err) {
            return res.send({message: err});
          } else {
            if(foundUser) {
              if(!foundUser.comparePassword(req.body.password)){
                return res.status(401).json({message: 'Wrong Password'});                
              }
              
              const date = new Date();
              foundUser.toc = date.toString();
              foundUser.save(function(err,user){
                if(err){return res.send({success: false, message:"Error while saving doc"})}
              });
              console.log(foundUser.toc);
              const user = {
                email: foundUser.email,
                toc: date.toString(),    //time of creation
              };
              var token = jwt.sign({ data: user}, config.secret,{
                expiresIn: TOKEN_EXPIRATION,
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

