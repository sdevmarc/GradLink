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

export interface IPromisePrograms {
    success: boolean
    message: string
    data?: IPrograms[] | {}
}