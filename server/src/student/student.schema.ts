import mongoose from "mongoose";

export const StudentSchema = new mongoose.Schema({
    idNumber: {
        type: String,
        required: true
    },
    generalInformation: {},
    educationalBackground: {},
    trainingAdvanceStudies: {},
    enrollments: [{
        semester: {
            type: Number,
            enum: [1, 2, 3],
            required: true,
        },
        progress: {
            type: String,
            enum: ['ongoing', 'done', 'dropout'],
            required: true,
            default: 'ongoing'
        },
        academic_year: {
            type: String,
            required: true
        },
        courses: [{
            courseno: {
                type: String,
                ref: 'Course',
                required: true
            }
        }]
    }],
    status: {
        type: String,
        required: true,
        enum: ['student', 'alumni'],
        default: 'student'
    },
    graduation_date: {
        type: String
    }
}, { timestamps: true })