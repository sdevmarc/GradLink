import mongoose from "mongoose";

export const CurriculumSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    descriptiveTitle: {
        type: String,
        required: true
    },
    major: {
        type: String,
        default: null
    },
    courses: {},
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })