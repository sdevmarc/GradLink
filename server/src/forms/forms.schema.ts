import mongoose from "mongoose";

export const FormsSchema = new mongoose.Schema({
    formId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true })