import mongoose from "mongoose";

export const OtpSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    otp: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })