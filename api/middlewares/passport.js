const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth2').Strategy;

var config = require("../config.js");

// var opts = {}
// opts.jwtFromRequest = function(req) { // tell passport to read JWT from cookies
//     var token = null;
//     if (req && req.cookies){
//         token = req.cookies['jwt']
//     }
//     return token
// };
// opts.secretOrKey = config.secret;

// // main authentication, our app will rely on it
// passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
//     console.log("JWT BASED AUTH GETTING CALLED") // called everytime a protected URL is being served
//     if (CheckUser(jwt_payload.data)) {
//         return done(null, jwt_payload.data)
//     } else {
//         // user account doesnt exists in the DATA
//         return done(null, false)
//     }
// }));
try{
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "ec2-35-90-111-64.us-west-2.compute.amazonaws.com:3001/auth/google/callback"
  },
  function(req,accessToken, refreshToken, profile, done) {
      //console.log(accessToken, refreshToken, profile)
      console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
    //   console.log(profile);
    
      return done(null,profile);
  }
));
}catch(err){console.log(err);}

// These functions are required for getting data To/from JSON returned from Providers
passport.serializeUser(function(user, done) {
    console.log('I should have jack ');
    // console.log(user);
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    console.log('I wont have jack shit')
    done(null, obj)
});

module.exports = function(app){

// Middlewares
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser());

//?? "required for passport"
app.set('trust proxy',1);
app.use(session({secret:config.secret,
resave:false,
saveUninitialized:true}));

app.use(passport.initialize());

// OAuth Authentication, Just going to this URL will open OAuth screens
app.get('/auth/google',  passport.authenticate('google', { scope: ['profile','email'] }),(req,res)=>{
    console.log(req);
});

//hehe boi
app.get('/auth/google/success',(req,res)=>{res.send(req.email)});
app.get('/auth/google/failure',(req,res)=>{res.send("failure")});

app.get( '/auth/google/callback',
    passport.authenticate( 'google'),(req,res)=>{res.send(req.user);});

// Oauth user data comes to these redirectURLs
// app.get('/auth/google/callback', passport.authenticate('google'
// ,{successRedirect:'https://youtube.com',failureRedirect:"https://amazon.com"}
// )
// ,(req, res)=>{
//     // console.log('redirected', req.user)
//     // console.log(req.user);
//     let user = {
//         displayName: req.user.displayName,
//         name: req.user.name.givenName,
//         email: req.user._json.email,
//         provider: req.user.provider }
//     console.log(user)
//     // const user = {
//     //     email: foundUser.email,
//     //     toc: date.toString(),    //time of creation
//     //   };
//     return res.send();
//     //   var token = jwt.sign({ data: user}, config.secret,{
//     //     expiresIn: 1000*60*60*24,
//     //   });

//     // FindOrCreate(user)
//     // let token = jwt.sign({
//     //     data: user
//     //     }, 'secret', { expiresIn: 60 }); // expiry in seconds
//     // res.cookie('jwt', token)
//     // res.redirect('/')
// }
// );
// // This url will only open, if the user is signed in
// app.get('/profile', passport.authenticate('jwt', { session: false }) ,(req,res)=>{
//     res.send(`Wellcome user ${req.user.email}`)
// });

};