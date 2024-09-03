import mongoose from "mongoose";

export const StudentSchema = new mongoose.Schema({
    generalInformation: [],
    educationalBackground: [],
    trainingAdvanceStudies: [],
    status: {
        type: String,
        required: true,
        enum: ['alumni', 'graduate'],
        default: 'alumni'
    },
    progress: {
        type: String,
        required: true,
        enum: ['ongoing', 'done', 'dropout'],
        default: 'ongoing'
    }
}, { timestamps: true })