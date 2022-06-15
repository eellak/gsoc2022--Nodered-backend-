var User = require("../models/user");

dashboard = function(req,res){
    console.log("reached7");
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
        console.log("reached");
        res.send({
            success:true, 
            message:"Successfully Authorized!", 
            accessToken:res.locals.token, 
            email:res.locals.email
        });
    });
};
fn2 = function(req,res){
    res.send("FN2");
};

module.exports = {dashboard,fn2};