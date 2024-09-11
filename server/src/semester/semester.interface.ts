interface ISemesterCourses {
    courseno: string
}

interface ISemesterPrograms {
    sid: string
    code: string
    courses: ISemesterCourses[]
}

export interface ISemester {
    sid?: string
    semester?: number,
    programs?: ISemesterPrograms[]
}

export interface IPromiseSemester {
    success: boolean
    message: string
    data?: ISemester[] | {}
}