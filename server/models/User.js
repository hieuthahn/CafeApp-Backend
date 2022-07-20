const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
    },
    publicSaved: {
        type: Boolean,
    },
    publicSocial: {
        type: Boolean,
    },
    avatar: {
        type: Buffer,
    },
    createdAt: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('users', UserSchema)
