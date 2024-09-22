import mongoose from "mongoose";

export const FormSchema = new mongoose.Schema({
    idNumber: {
        type: String,
        ref: 'Student',
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    date_sent: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true })