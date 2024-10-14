import mongoose from "mongoose"

export interface IPrograms {
    pid?: mongoose.Schema.Types.ObjectId
    code?: string
    descriptiveTitle?: string
    residency?: number
    curriculumId?: mongoose.Schema.Types.ObjectId
}

export interface IRequestPrograms {
    name?: string
    programs?: IPrograms[]
    curriculumId?: string
}

export interface IPromisePrograms {
    success: boolean
    message: string
    data?: IPrograms[] | {}
}