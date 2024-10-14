import mongoose from "mongoose";

export const CoursesSchema = new mongoose.Schema({
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
    programs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
        required: true,
    }],
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
}, { timestamps: true })