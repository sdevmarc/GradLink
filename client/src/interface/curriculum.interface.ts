import { IAPICourse } from "./course.interface"

export interface IRequestCourse {
    categoryName: string
    courses?: string[]
}

export interface IShowCategories {
    categoryName: string
    courses?: IAPICourse[]
}

export interface IRequestCurriculum {
    name: string
    programCode: string
    major: string
    categories: IRequestCourse[]
    showcategories?: IShowCategories[]
}