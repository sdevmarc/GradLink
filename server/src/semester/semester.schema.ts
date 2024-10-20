import mongoose from "mongoose";

export const SemesterSchema = new mongoose.Schema({
    semester: {
        type: Number,
        required: true,
        enum: [1, 2, 3]
    },
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    }],
}, { timestamps: true })