import mongoose from "mongoose";

export const CurriculumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    programCode: {
        type: String,
        required: true,
    },
    major: {
        type: String,
        default: null
    },
    categories: [],
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })