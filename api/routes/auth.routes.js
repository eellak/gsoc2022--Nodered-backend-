var express = require("express");
var router = express.Router();
var controller = require("../controllers/auth.controller")

//No need of authorizing here, so leaving out authJwt
const { verifySignUp } = require("../middlewares");
// const controller = require("../controllers/")


// router.get("/authenticate", (req,res)=>{
//     // res.sendFile( /j/gfoss/index.html);
// res.sendFile(__dirname+"/index.html");
// });

//auth-routes

router.post("/api/login", controller.userLogin);

router.post("/api/register", controller.userRegister, controller.userLogin);

module.exports = router;



