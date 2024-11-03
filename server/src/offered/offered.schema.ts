import mongoose from "mongoose";

export const OfferedSchema = new mongoose.Schema({
    semester: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    academicYear: {
        startDate: {
            //2022 for example
            type: Number,
            required: true
        },
        endDate: {
            //2023 for example
            type: Number,
            required: true
        },
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }],
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true })