import mongoose from "mongoose";

export const StudentSchema = new mongoose.Schema({
    idNumber: {
        type: String,
        unique: true,
        // required: true
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
    coordinates: {
        latitude: Number,
        longitude: Number
    },
    undergraduateInformation: {
        college: {
            type: String,
            required: true,
            default: 'None'
        },
        school: {
            type: String,
            required: true,
            default: 'None'
        },
        programGraduated: {
            type: String,
            required: true,
            default: 'None'
        },
        yearGraduated: {
            type: String,
            required: true,
            default: 'None'
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
    // educationalBackground: {},
    employmentData: {},
    trainingAdvanceStudies: {},
    isenrolled: {
        type: Boolean,
        required: true,
        default: false
    },
    isresidencylapsed: {
        type: Boolean,
        default: null
    },
    // assessmentForm: {
    //     type: String,
    //     default: null
    // },
    assessment: {
        assessmentForm: {
            type: String,
            default: null
        },
        reasons: {
            financialDifficulties: Boolean,
            personalFamily: Boolean,
            healthIssues: Boolean,
            workCommitments: Boolean,
            lackOfInterest: Boolean,
            relocation: Boolean,
            programDissatisfaction: Boolean,
            betterOpportunities: Boolean,
            timeConstraints: Boolean,
            careerGoals: Boolean,
            academicChallenges: Boolean,
            transfer: Boolean,
            visaIssues: Boolean,
            discrimination: Boolean,
            lackOfSupport: Boolean,
            programExpectations: Boolean,
            familyEmergency: Boolean,
            academicRigor: Boolean,
            mentalHealth: Boolean,
            specificGoals: Boolean,
            other: Boolean,
            otherText: String
        }
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