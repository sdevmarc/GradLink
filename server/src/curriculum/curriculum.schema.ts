import mongoose from "mongoose";

export const CurriculumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, 
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })