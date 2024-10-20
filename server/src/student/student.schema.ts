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
        progress: {
            type: String,
            enum: ['ongoing', 'done', 'dropout'],
            required: true,
            default: 'ongoing'
        },
        enrollment_date: {
            type: Date,
            required: true,
            default: Date.now
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
            },
            // ispass: {
            //     type: Boolean,
            //     required: true,
            //     default: true
            // }
        }]
    }],
    isenrolled: {
        type: Boolean,
        required: true,
        default: false
    },
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