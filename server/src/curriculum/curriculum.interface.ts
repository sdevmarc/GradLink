interface ICategories {
    categoryName: string
    courses: string[]
}

export interface ICurriculum {
    _id?: string
    name?: string
    programid?: string
    major?: string
    categories?: ICategories[]
    isActive?: boolean
}

export interface IPromiseCurriculum {
    success: boolean
    message: string
    data?: ICurriculum[] | {}
}
