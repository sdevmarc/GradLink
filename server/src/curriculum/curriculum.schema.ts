import mongoose from "mongoose";

export const CurriculumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    programid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
        required: true,
    },
    major: {
        type: String,
        default: null
    },
    year: {
        type: String,
        required: true
    },
    categories: [{
        categoryName: {
            type: String,
            required: true
        },
        courses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        }]
    }],
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })