import mongoose from "mongoose"

export interface IPrograms {
    id?: mongoose.Schema.Types.ObjectId
    userId?: mongoose.Schema.Types.ObjectId
    code?: string
    descriptiveTitle?: string
    residency?: number
    department?: string
    createdAt?: string
}

interface AttritionStats {
    totalStudentEnrolled: number;
    totalStudentDiscontinued: number;
    attritionRate: number;
}

export interface IProgramForAttrition {
    _id: string;
    code: string;
    descriptiveTitle: string;
    residency: number;
    past3years: AttritionStats;
    yearly: AttritionStats;
}

export interface IAttritionProgram {
    program: mongoose.Types.ObjectId;
    academicYear: string;
    totalStudents: number;
    totalDiscontinue: number;
    attritionRate: number;
}

export interface IPromisePrograms {
    success: boolean
    message: string
    data?: IPrograms[] | {}
}