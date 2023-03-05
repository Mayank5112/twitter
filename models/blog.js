const { logger } = require('mongodb');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/twatter', { useNewUrlParser: true });

const bSchema = new mongoose.Schema({
    title: {
        type: String,
        require: [true]
    },
    content: {
        type: String,
        required: [true]
    },
    userName: {
        type: String,
        require: [true]
    }
})

module.exports = mongoose.model('blog', bSchema);