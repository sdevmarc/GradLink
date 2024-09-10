import mongoose from "mongoose"

export interface IPrograms {
    pid?: mongoose.Schema.Types.ObjectId
    code?: string
    descriptiveTitle?: string
    units?: number
    enrolled?: number
    residency?: number
}

export interface IPromisePrograms {
    success: boolean
    message: string
    data?: IPrograms[] | {}
}