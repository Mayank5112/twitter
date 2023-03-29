import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/twatter', { useNewUrlParser: true });


const uSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true]
    },
    password: {
        type: String,
        required: [true]
    }
});

uSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ userName: username });
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false
}

uSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const User = mongoose.model('user', uSchema);

export { User }