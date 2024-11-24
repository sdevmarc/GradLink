import mongoose from "mongoose";

export const AuditSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        enum: ['user_login', 'settings_changed', 'user_created', 'password_changed', 'program_changed', 'course_changed', 'curriculum_changed', 'semester_changed', 'student_changed'],
        required: true,
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true })