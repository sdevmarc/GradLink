import mongoose from "mongoose";

export const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'User'
    },
    email: {
        type: String,
        required: true,
        default: 'admin'
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['root', 'admin', 'user'],
        default: 'user'
    },
    isactive: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })