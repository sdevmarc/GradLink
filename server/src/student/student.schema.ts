import mongoose from "mongoose";

export const StudentSchema = new mongoose.Schema({
    sid: {
        type: String,
        required: true
    },
    generalInformation: {},
    educationalBackground: {},
    trainingAdvanceStudies: {},
    // programs: [{
    //     code: {
    //         type: String,
    //         required: true
    //     },
    //     course: [{
    //         courseno: {
    //             type: String,
    //             ref: 'Course',
    //             required: true
    //         }
    //     }]
    // }],
    status: {
        type: String,
        required: true,
        enum: ['student', 'alumni'],
        default: 'student'
    },
    progress: {
        type: String,
        required: true,
        enum: ['ongoing', 'done', 'dropout'],
        default: 'ongoing'
    }
}, { timestamps: true })