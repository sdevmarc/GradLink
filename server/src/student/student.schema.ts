import mongoose from "mongoose";

export const StudentSchema = new mongoose.Schema({
    idNumber: {
        type: String,
        unique: true,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    middlename: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    program: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'Program',
        ref: 'Curriculum',
        required: true
    },
    generalInformation: {},
    educationalBackground: {},
    trainingAdvanceStudies: {},
    isenrolled: {
        type: Boolean,
        required: true,
        default: false
    },
    enrollments: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        enrollmentDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        ispass: {
            type: String,
            required: true,
            // enum: ['pass', 'fail', 'inc', 'ongoing'],
            enum: ['pass', 'fail', 'inc', 'ongoing', 'drop'],
            default: 'ongoing'
        }
    }],
    status: {
        type: String,
        required: true,
        // enum: ['student', 'alumni', 'enrollee', 'drop'],
        enum: ['student', 'alumni', 'enrollee'],
        default: 'enrollee'
    },
    graduation_date: {
        type: Date
    }
}, { timestamps: true })