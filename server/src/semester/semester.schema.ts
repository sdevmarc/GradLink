import mongoose from "mongoose";

export const SemesterSchema = new mongoose.Schema({
    semester: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    programs: [{
        sid: {
            type: String,
            ref: 'Student',
            required: true
        },
        code: {
            type: String,
            ref: 'Program',
            required: true
        },
        courses: [{
            courseno: {
                type: String,
                ref: 'Course',
                required: true
            }
        }]
    }]
}, { timestamps: true })