interface ICategories {
    categoryName: string
    courses: string[]
}

export interface ICurriculum {
    name?: string
    programCode?: string
    major?: string
    categories?: ICategories[]
    isActive?: boolean
}

export interface IPromiseCurriculum {
    success: boolean
    message: string
    data?: ICurriculum[] | {}
}
