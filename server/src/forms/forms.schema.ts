import mongoose from "mongoose";

export const FormSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    generalInformation: {},
    employmentData: {},
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: null
    }
}, { timestamps: true })