import mongoose from "mongoose";

export const AuditSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true })