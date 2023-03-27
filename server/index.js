import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
//  services
import { login, logout, register, requireLogin } from "./services/auth.service.js";
import { deleteTweet, editTweet, getPosts, newTweet, postTweet } from "./services/tweets.services.js";
import { getUserDetails } from "./services/user.services.js";


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "notagoodsecret",
    resave: true,
    saveUninitialized: true
}));

// HOME PAGE 
app.get("/home", requireLogin, getPosts)

// auth routes
app.post("/login", login);
app.post("/register", register)
app.post("/logout", logout)
app.get("/profile", requireLogin, getUserDetails)



// tweet routes
app.get("/compose/:userID", requireLogin, newTweet)
app.post("/compose/:userID", requireLogin, postTweet)
app.put("/edit/:userID", requireLogin, editTweet)
app.delete("/delete/:userID", deleteTweet)

app.listen(port, () => { console.log(`Running on port ${port} \nthis is the blog application`); })