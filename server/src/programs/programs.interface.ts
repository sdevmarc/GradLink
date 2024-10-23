import mongoose from "mongoose"

export interface IPrograms {
    id?: mongoose.Schema.Types.ObjectId
    code?: string
    descriptiveTitle?: string
    residency?: number
}

export interface IRequestPrograms {
    programs?: IPrograms[]
}

export interface IPromisePrograms {
    success: boolean
    message: string
    data?: IPrograms[] | {}
}