import e from "express";
import { Blog } from "../models/blog.js";
import { User } from "../models/user.js";
async function login(req, res) {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.json({
            "currUser": foundUser.userName
        })
    } else {
        res.end("something is wrong")
    }
}

async function register(req, res) {
    const { username, password } = req.body;
    User.findOne({ username })
        .then(() => {
            res.send("user already exists");
            return;
        })
        .catch((err) => res.json(err))
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

function logout(req, res) {
    req.session.user_id = null;
    req.session.destroy();
    res.redirect("/login")
}
const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.send("login required")
        // return res.redirect("/login");
    }
    next();
}


export { requireLogin, login, register, logout };