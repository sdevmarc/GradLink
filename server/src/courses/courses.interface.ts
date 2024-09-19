export interface ICourses {
    cid?: string
    courseno?: string
    descriptiveTitle?: string
    degree?: string
    units?: number
    pre_req?: string
}

export interface IPromiseCourse {
    success: boolean
    message: string
    data?: ICourses[] | {}
}
