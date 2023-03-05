const express = require("express");
const bodyParser = require('body-parser')
const ejs = require('ejs')
const port = 3000;
const User = require('./models/user');
const Blog = require('./models/blog')
const { response } = require("express");
const bcrypt = require('bcrypt');
const session = require('express-session');
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
        return res.redirect("/login");
    }
    next();
}
// HOME PAGE 
app.get("/home", requireLogin, async (req, res) => {
    const currId = req.session.user_id
    const currUser = await User.findById({ _id: currId })
    const allPost = await Blog.find({});
    res.render("home", { currUser: currUser, posts: allPost })
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
        res.redirect("/home")
    } else {
        res.redirect("/login");
    }
});

// sign up routes
app.get("/register", async (req, res) => {
    res.render("register")
})

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const newUser = User({ userName: username, password: password })
    await newUser.save();
    req.session.user_id = newUser._id;
    res.redirect("/home")
})

app.get("/profile", requireLogin, async (req, res) => {
    const currId = req.session.user_id
    const currUser = await User.findById({ _id: currId })
    res.render("profile", { currUser: currUser })
})



// compose tweet

app.get("/compose/:userId", requireLogin, (req, res) => {
    const currUser = req.params.userId;
    res.render("compose", { currUser })
})

app.post("/compose/:userID", async (req, res) => {
    const { title, content } = req.body;
    const newBlog = Blog({ title: title, content: content, userName: req.params.userID });
    await newBlog.save();
    res.redirect("/home")
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