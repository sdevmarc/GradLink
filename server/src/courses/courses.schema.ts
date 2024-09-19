import mongoose from "mongoose";

export const CoursesSchema = new mongoose.Schema({
    courseno: {
        type: String,
        required: true
    },
    descriptiveTitle: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        ref: 'Program',
        required: true
    },
    pre_req: {
        type: String,
        required: true,
        default: 'None'
    },
    units: {
        type: Number,
        required: true,
        default: 0
    },
}, { timestamps: true })