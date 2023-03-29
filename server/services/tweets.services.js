import { ObjectId } from "mongodb";
import { Blog } from "../models/blog.js";
import { User } from "../models/user.js";
async function getPosts(req, res) {
    const currId = req.session.user_id
    const currUser = await User.findById({ _id: currId })
    const allPost = await Blog.find({});
    res.json({
        "currUser": currUser, "posts": allPost
    })
}
function newTweet(req, res) {
    const currUser = req.params.userId;
    res.json({ currUser })
}
async function postTweet(req, res) {
    const user = req.params.userID;
    const newPost = { title: req.body.title, content: req.body.content };
    const userCollection = await Blog.findOneAndUpdate({ userName: user }, { $push: { tweets: newPost } }, { new: true });
    res.json(userCollection);
}
async function editTweet(req, res) {
    const tweetId = req.query._id;
    const user = req.params.userID;
    const tweet = req.body.tweet;
    const doc = await Blog.findOneAndUpdate({ userName: user, "tweets._id": tweetId },
        {
            $set: {
                "tweets.$.content": tweet
            }
        },
        { new: true }
    );
    res.json(doc);
}


async function deleteTweet(req, res) {
    const user = req.params.userID;
    const tweetId = req.query._id;
    await Blog.findOneAndUpdate({ userName: user, "tweets._id": tweetId },
        { $pull: { tweets: { _id: tweetId } } },
        { new: true }
    )
        .then((docs) => {
            res.json({ "updated tweets": docs.tweets, "message": "succesfully deleted the tweet" });
        })
        .catch((err) => {
            res.json(err);
        })
}
export { getPosts, postTweet, editTweet, newTweet, deleteTweet }