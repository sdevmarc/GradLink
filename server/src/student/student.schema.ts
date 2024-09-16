import mongoose from "mongoose";

export const StudentSchema = new mongoose.Schema({
    idNumber: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
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
        year: {
            type: String,
            required: true
        },
        courses: [{
            courseno: {
                type: String,
                required: true
            },
            descriptive_title: {
                type: String,
                required: true
            },
            units: {
                type: Number,
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
        type: Date
    }
}, { timestamps: true })