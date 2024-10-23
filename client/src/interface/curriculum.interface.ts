import { IAPICourse } from "./course.interface"

interface IRequestCourse {
    categoryName: string
    courses: IAPICourse[]
}

export interface IRequestCurriculum {
    code: string
    major: string
    categories: IRequestCourse[]
}