import mongoose from "mongoose";

export const SettingsSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true,
        default: 0
    },
    isenroll: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })