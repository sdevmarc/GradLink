
interface IPrerequisite {
    courseno: string
}

export interface ICourses {
    _id?: string
    code?: number
    courseno?: string
    descriptiveTitle?: string
    units?: number
    prerequisites?: IPrerequisite[]
    isoffered?: boolean
}

export interface IRequestCourses {
    id: ICourses[]
}

export interface IPromiseCourse {
    success: boolean
    message: string
    data?: ICourses[] | {}
}
