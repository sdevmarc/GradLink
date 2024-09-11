export interface ICourses {
    cid?: string
    courseno?: string
    descriptiveTitle?: string
    degree?: string
    units?: number
}

export interface IPromiseCourse {
    success: boolean
    message: string
    data?: ICourses[] | {}
}
