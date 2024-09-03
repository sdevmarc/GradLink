import mongoose from "mongoose";

export const UsersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    isactive: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })