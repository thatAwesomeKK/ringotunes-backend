const mongoose = require('mongoose')
const { Schema } = mongoose

const ringSchema = new Schema({
    ringID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'media',
        required: true
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    title: {
        type: String,
        required: true,
        default: 'TITLE'
    },
    thumbnail: {
        type: String,
        required: true,
        default: 'https://i.ytimg.com/vi/4nVDijlvVG0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDOMfXeLp85kb4gy1ZlTmzU05rKAQ',
    },
    origin: {
        type: String,
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    downloads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }]
}, { timestamps: true });

module.exports = mongoose.model('ring', ringSchema)