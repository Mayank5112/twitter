import mongoose from "mongoose";
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/twatter', { useNewUrlParser: true });

const bSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: [true]
    },
    tweets: [{
        title: String,
        content: String
    }]
})

const Blog = mongoose.model('blog', bSchema);

export { Blog }