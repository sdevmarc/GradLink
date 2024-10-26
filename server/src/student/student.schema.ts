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
        default: false
    },
    enrollments: [{
        // semester: {
        //     type: Number,
        //     required: true,
        //     enum: [1, 2, 3]
        // },
        course: {
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
            enum: ['pass', 'fail', 'ongoing'],
            default: 'ongoing'
        }
    }],
    status: {
        type: String,
        required: true,
        enum: ['student', 'alumni', 'enrollee', 'drop'],
        default: 'enrollee'
    },
    graduation_date: {
        type: Date
    }
}, { timestamps: true })