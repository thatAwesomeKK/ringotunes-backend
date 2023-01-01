const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    pfp:{
        type: String,
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
    },
}, {timestamps: true})

module.exports = mongoose.model('user', userSchema)