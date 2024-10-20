import mongoose from "mongoose"

export interface ISemester {
    semester?: number
    studentsEnrolled?: string
    curriculumId?: string
}

export interface IPromiseSemester {
    success: boolean
    message: string
    data?: ISemester[] | {}
}
