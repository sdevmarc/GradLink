import mongoose from "mongoose";

export const SemesterSchema = new mongoose.Schema({
    semester: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    academic_year: {
        type: String,
        required: true
    }
}, { timestamps: true })