interface IPre_req {
    courseno: string
}

interface IDegree {
    code: string
}

export interface ICourses {
    cid?: string
    courseno?: string
    descriptiveTitle?: string
    degree?: IDegree[]
    units?: number
    pre_req?: IPre_req[]
}

export interface IPromiseCourse {
    success: boolean
    message: string
    data?: ICourses[] | {}
}
