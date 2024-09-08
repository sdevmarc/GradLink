import mongoose from "mongoose";

export const ProgramSchema = new mongoose.Schema({
    program: []
}, { timestamps: true })