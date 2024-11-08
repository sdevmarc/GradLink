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
        ref: 'Curriculum',
        required: true
    },
    undergraduateInformation: {
        college: {
            type: String,
            required: true
        },
        school: {
            type: String,
            required: true
        },
        programGraduated: {
            type: String,
            required: true
        },
        yearGraduated: {
            type: String,
            required: true
        }
    },
    achievements: {
        awards: {
            type: String,
            default: 'None'
        },
        examPassed: {
            type: String,
            default: 'None'
        },
        examDate: {
            type: String,
            default: 'None'
        },
        examRating: {
            type: String,
            default: 'None'
        }
    },
    generalInformation: {},
    educationalBackground: {},
    trainingAdvanceStudies: {},
    isenrolled: {
        type: Boolean,
        required: true,
        default: false
    },
    //Will be implemented later
    assessmentForm: {
        type: String,
        default: null
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
            enum: ['pass', 'fail', 'inc', 'ongoing', 'drop', 'discontinue'],
            default: 'ongoing'
        },
    }],
    status: {
        type: String,
        required: true,
        enum: ['student', 'alumni', 'enrollee'],
        default: 'enrollee'
    },
    graduation_date: {
        type: Date
    }
}, { timestamps: true })