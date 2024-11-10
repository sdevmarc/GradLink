import mongoose from "mongoose"


export interface ICourses {
    _id?: string
    userId?: mongoose.Schema.Types.ObjectId
    code?: number
    courseno?: string
    descriptiveTitle?: string
    units?: number
    isoffered?: boolean
    curriculumid?: string
}

export interface IRequestCourses {
    id: ICourses[]
}

export interface IPromiseCourse {
    success: boolean
    message: string
    data?: ICourses[] | {}
}
