import { IAPICourse } from "./course.interface"

export interface IRequestCourse {
    categoryName: string
    courses?: string[]
}

export interface IShowCategories {
    categoryName: string
    courses?: IAPICourse[]
}

export interface ICurriculum {
    _id?: string
    name: string
    programid: string
    major: string
    categories: IRequestCourse[]
    showcategories?: IShowCategories[]
    program?: string
    programcode?: string
    programDescriptiveTitle?: string
}