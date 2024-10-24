import { IAPICourse } from "./course.interface"

interface IRequestCourse {
    categoryName: string
    courses: IAPICourse[]
}

export interface IRequestCurriculum {
    programCode: string
    major: string
    categories: IRequestCourse[]
}