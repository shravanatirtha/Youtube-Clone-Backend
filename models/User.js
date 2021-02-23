const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    phoneNumber: { type: String },
}, {
    collection: "User"
})

const User = mongoose.model('User', userSchema);

module.exports = User;