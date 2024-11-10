import mongoose from "mongoose";

export interface IAuditlog {
    userId: mongoose.Schema.Types.ObjectId
    action: string;
    description: string;
}
