import mongoose from "mongoose";

export const MailSchema = new mongoose.Schema({
    idNumber: {
        type: String,
        ref: 'Student',
        required: true
    },
    date_sent: {
        type: Date,
        required: true,
        default: Date.now
    },
    notes: {
        type: String,
        required: true
    }
}, { timestamps: true })