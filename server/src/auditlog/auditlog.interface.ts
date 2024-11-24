import mongoose from "mongoose";

export interface IAuditlog {
    userId: mongoose.Schema.Types.ObjectId
    action: 'user_login' | 'settings_changed' | 'user_created' | 'password_changed' | 'program_changed' | 'course_changed' | 'curriculum_changed' | 'semester_changed' | 'student_changed'
    description: string;
}

export interface IPromiseAudit {
    success: boolean
    message: string
}
