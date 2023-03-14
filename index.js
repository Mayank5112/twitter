const express = require("express");
const bodyParser = require('body-parser')
const ejs = require('ejs')
const port = 3000;
const User = require('./models/user');
const Blog = require('./models/blog')
const { response } = require("express");
const bcrypt = require('bcrypt');
const session = require('express-session');
const http = require("http");
const { collection } = require("./models/user");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: "notagoodsecret",
    resave: true,
    saveUninitialized: true
}));

// login middleware
const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.send("login required")
        // return res.redirect("/login");
    }
    next();
}
// HOME PAGE 
app.get("/home", requireLogin, async (req, res) => {
    const currId = req.session.user_id
    const currUser = await User.findById({ _id: currId })
    const allPost = await Blog.find({});
    res.json({
        "currUser": currUser, "posts": allPost
    })
    // res.render("home", { currUser: currUser, posts: allPost })
})
// login routes
app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.json({
            "currUser": foundUser.userName
        })
        // res.redirect("/home")
    } else {
        res.end("something is wrong")
    }
});

// sign up routes
app.get("/register", async (req, res) => {
    res.render("register")
})

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const check = User.findOne({ username });
    if (check) {
        res.send("user already exist");
    } else {

        const newUser = User({ userName: username, password: password });
        const newCollection = Blog({ userName: username });
        await newUser.save();
        await newCollection.save();
        req.session.user_id = newUser._id;
        res.json({
            "collection": newCollection,
            "user": newUser
        })
    }
    // res.redirect("/home");
})

app.get("/profile", requireLogin, async (req, res) => {
    const currId = req.session.user_id
    const currUser = await User.findById({ _id: currId })
    res.render("profile", { currUser: currUser.userName })
})



// compose tweet

app.get("/compose/:userID", requireLogin, (req, res) => {
    const currUser = req.params.userId;
    res.render("compose", { currUser })
})

app.post("/compose/:userID", requireLogin, async (req, res) => {
    const user = req.params.userID;
    const newPost = { title: req.body.title, content: req.body.content };
    console.log(newPost);
    const userCollection = await Blog.findOneAndUpdate({ userName: user }, { $push: { tweets: newPost } });
    res.send("userCollection");
    // res.redirect("/home")
})
app.get("/info", (req, res) => {
    res.render("info")
})

// logout
app.post("/logout", (req, res) => {
    req.session.user_id = null;
    req.session.destroy();
    res.redirect("/login")
})
app.listen(port, () => { console.log(`Running on port ${port} \nthis is the blog application`); })