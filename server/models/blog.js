const { logger } = require('mongodb');
const mongoose = require('mongoose');
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

module.exports = mongoose.model('blog', bSchema);