const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
    // app.use(function(req, res, next){ 
    //     res.header(
    //         "Access-Control-Allow-Headers",
    //         "x-access-token, Origin, Content-Type, Accept"
    //     );
    //     next();
    // });


    // app.get("/", controller.fn1);
    
    //using middleware/chain of it, to authorize request for protected route.
    app.get("/api/dashboard", [authJwt], controller.dashboard);
    app.post("/api/logout", [authJwt], controller.userLogout);
    app.post("/api/n");
    app.get("/api/temp",(req,res) => {
        res.send("hello from apI");
    });
    app.post("/api/fresh",(req,res) => {

    });
};