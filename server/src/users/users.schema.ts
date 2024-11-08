import mongoose from "mongoose";

export const UsersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        default: 'admin'
    },
    password: {
        type: String,
        required: true,
        default: 'admin'
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