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
    degree: [{
        code: {
            type: String,
            required: true,
            ref: 'Program'
        }
    }],
    pre_req: [{
        courseno: {
            type: String,
            default: 'None'
        }
    }],
    units: {
        type: Number,
        required: true,
        default: 0
    },
}, { timestamps: true })