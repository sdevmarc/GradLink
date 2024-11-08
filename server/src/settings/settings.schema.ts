import mongoose from "mongoose";

export const SettingsSchema = new mongoose.Schema({
    isenroll: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true })