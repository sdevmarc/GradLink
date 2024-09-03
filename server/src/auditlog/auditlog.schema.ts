import mongoose from "mongoose";

export const AuditSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        enum: ['create', 'update', 'delete', 'read'],
        required: true,
    },
    collectionName: {
        type: String,
        required: true,
    },
    changes: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true })