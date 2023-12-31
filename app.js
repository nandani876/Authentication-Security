require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

// console.log(md5("12345"));

app.use(express.static("public"));
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB")
.then(() => console.log("connection successfull..."))
.catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
    email: String ,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});
app.get("/login", function(req, res){
    res.render("login");
});
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username ,
        password: md5(req.body.password)
    });
    newUser.save()
    .then(() => {
     res.render("secrets");
    })
  .catch((err) => {
    console.log(err);
  });

});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({ email: username })
    .then(foundUser => {
      if (foundUser && foundUser.password === password) {
        console.log("Password matched. Successfully authenticated.");
        res.render("secrets");
      } else {
        console.log("Password did not match or user not found.");
      }
    })
    .catch(err => {
      console.log(err);
    });   
});

app.listen(3000, function(){
    console.log("server started on port 3000")
})
