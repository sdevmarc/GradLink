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
    isenrolled: {
        type: Boolean,
        required: true,
        default: true
    },
    enrollments: [{
        semester: {
            type: Number,
            required: true,
            enum: [1, 2, 3]
        },
        course: {
            //change to course code
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        enrollmentDate: {
            type: Date,
            default: Date.now
        },
        ispass: {
            type: String,
            enum: ['pass', 'fail', 'in-progress'],
            default: 'in-progress'
        }
    }],
    status: {
        type: String,
        required: true,
        enum: ['student', 'alumni', 'drop'],
        default: 'student'
    },
    graduation_date: {
        type: Date
    }
}, { timestamps: true })