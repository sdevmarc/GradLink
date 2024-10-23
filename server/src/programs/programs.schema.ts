import mongoose from "mongoose";

export const ProgramSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,  // Program codes should be unique
        index: true    // Index for fast lookup
    },
    descriptiveTitle: {
        type: String,
        required: true
    },
    residency: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true })