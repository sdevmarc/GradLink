import mongoose from "mongoose";

export const FormsSchema = new mongoose.Schema({
    form: []
}, { timestamps: true })