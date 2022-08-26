const jwt = require("jsonwebtoken");
const config = require("../config.js");
var User = require("../models/user");


verifyToken = (req, res, next) => { 
// console.log(req.headers);
    let token = req.headers["authorization"] || req.headers["Authorization"];
    if(!token) {
        return res.status(403).send({message: "No token provided!"});
    }
     token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            return res.status(401).send({ message: err.message });
        }
        User.findOne({email: decoded.data.email}, function(err,foundUser){
            if(err){
                return res.send({success:false, message:err});//issue: see documentation
            }
            
            if(foundUser.toc === decoded.data.toc){
                
                //updating toc "time of creation" in db and sending fresh accesstoken
                const date = new Date();
                foundUser.toc = date.toString();
                foundUser.save(function(err){
                    if(err){return res.send({success: false, message:"Error while saving doc"})}
                });
                    
                
                //data in the token payload
                const user = {
                  email: foundUser.email,
                  toc: date.toString(),    //time of creation
                };
            
                
                
                var token = jwt.sign({ data: user}, config.secret,{expiresIn: 1000*60*60*24,});
                
               
            res.locals.email = decoded.data.email;
            res.locals.username = foundUser.username;
            res.locals.token = token;
            // req.locals.accessibility;
            
                next();
            }
            else
            {
                res.send({success:false, message:"Expired token"});
            }
        });
 
    });
};
module.exports = verifyToken;