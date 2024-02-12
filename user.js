const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    UserName: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true 
    },
    role: { type: String, default: "User" }
}, {timestamps: true})


const User = mongoose.model('Client',userSchema)
module.exports = User
