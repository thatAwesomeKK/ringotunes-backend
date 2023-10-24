import mongoose from 'mongoose'

export const userSchema = new mongoose.Schema({
    pfp: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
}, { timestamps: true })

export default mongoose.model('user', userSchema)