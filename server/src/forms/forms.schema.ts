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
    status: {
        type: String,
        enum: ['active', 'trash'],
        required: true,
        default: 'active'
    }
}, { timestamps: true })