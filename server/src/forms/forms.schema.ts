import mongoose from "mongoose";

export const FormSchema = new mongoose.Schema({
    sid: {
        type: String,
        required: true
    },
    generalInformation: {},
    educationalBackground: {},
    trainingAdvanceStudies: {},
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        required: true,
        default: 'pending'
    }
}, { timestamps: true })