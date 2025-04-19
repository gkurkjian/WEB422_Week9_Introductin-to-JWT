// the package installed npm i dotenv, npm i bcryptjs

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userService = require("./user-service.js");
const dataService = require("./data-service.js");

const app = express();
app.use(cors());
app.use(express.json());

const HTTP_PORT = process.env.PORT || 8080;

// Here will display the info of vehicles from data-service.js
app.get("/api/vehicles", (req,res)=>{
    dataService.getAllVehicles().then((data)=>{
        res.json(data);
    }).catch(()=>{
        res.status(500).end();
    });
});

// This function I created to Check the users exists in DataBase
app.get("/api/users", (req,res) => {
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
        res.json({ message: 'user is logged in successful' });
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

