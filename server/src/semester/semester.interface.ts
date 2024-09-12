export interface ISemester {
    sid?: string
    semester?: number,
    academic_year?: string
}

export interface IPromiseSemester {
    success: boolean
    message: string
    data?: ISemester[] | {}
}