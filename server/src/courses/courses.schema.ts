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
        unique: true,  // Ensure course number is unique
        index: true  // Index for faster lookups
    },
    descriptiveTitle: {
        type: String,
        required: true
    },
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: 'None'
    }],
    units: {
        type: Number,
        required: true,
        default: 0
    },
    isoffered: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })