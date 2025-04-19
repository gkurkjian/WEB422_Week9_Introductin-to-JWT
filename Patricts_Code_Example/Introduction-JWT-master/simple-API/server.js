// the package installed npm i dotenv, npm i bcryptjs, npm i jsonwebtoken, npm i passport, npm i passport-jwt

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userService = require("./user-service.js");
const dataService = require("./data-service.js");
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

// THIS IS BIG CHUNK OF BOILER PLATE

// JSON Web Token Setup
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

// Configure its options
let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.JWT_KEY
};

// IMPORTANT - this secret should be a long, unguessable string
// (ideally stored in a "protected storage" area on the web server).
// We suggest that you generate a random 50-character string
// using the following online tool:
// https://lastpass.com/generatepassword.php

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log('payload received', jwt_payload);

  if (jwt_payload) {
    // The following will ensure that all routes using
    // passport.authenticate have a req.user._id, req.user.userName, req.user.fullName & req.user.role values
    // that matches the request payload data
    next(null, {
      _id: jwt_payload._id,
      userName: jwt_payload.userName,
      fullName: jwt_payload.fullName,
      role: jwt_payload.role,
    });
  } else {
    next(null, false);
  }
});

// Here is the middleware

// tell passport of use our "strategy"
passport.use(strategy);

const app = express();
app.use(cors());
app.use(express.json());
// add passport as application-level middleware
app.use(passport.initialize());

const HTTP_PORT = process.env.PORT || 8080;

// Here will display the info of vehicles from data-service.js
app.get("/api/vehicles", passport.authenticate('jwt', { session: false }), (req,res)=>{
    dataService.getAllVehicles().then((data)=>{
        res.json(data);
    }).catch(()=>{
        res.status(500).end();
    });
});

// This function I created to Check the users exists in DataBase
app.get("/api/users", passport.authenticate('jwt', { session: false }), (req,res) => {
    userService.getAllUsers()
    .then(users => {
        res.json(users);
    })
    .catch(err => {
        res.status(500).json({ message: "Unable to fetch users." });
    })
})

app.post("/api/register", (req, res) => {
    userService.registerUser(req.body)
        .then(msg => {
            res.json({ message: msg });
        })
        .catch(err => {
            console.error("Register error:", err);
            res.status(422).json({ message: err });
        });
});

// This method is to request and display the name+password of user but,
//because the password in checkUser is bcrypt/hashed, we have to use this procedure
app.post('/api/login', (req, res) => {
    userService.checkUser(req.body)
      .then((user) => {

        let payload = { 
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            role: user.role
        };

        let token = jwt.sign(payload, jwtOptions.secretOrKey);

        res.json({ message: `user: ${user.userName} is logged in successful, token: `, token });
        console.log(`user: ${user.userName}, logged in successfully.`)
      })
      .catch((msg) => {
        res.status(422).json({ message: msg }); 
      });
  });

app.use((req, res) => {
    res.status(404).end();
});

userService.connect().then(() => {
    app.listen(HTTP_PORT, ()=>{
    console.log("App listening on: " + HTTP_PORT);
});
}).catch(err=>{
    console.log(err);
})
