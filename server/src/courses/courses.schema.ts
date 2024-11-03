import mongoose from "mongoose";

export const CoursesSchema = new mongoose.Schema({
    code: {
        type: Number,
        required: true,
        unique: true,
    },
    courseno: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    descriptiveTitle: {
        type: String,
        required: true
    },
    units: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true })