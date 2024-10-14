
export interface ICurriculum {
    name?: string
    isActive?: boolean
}

export interface IPromiseCurriculum {
    success: boolean
    message: string
    data?: ICurriculum[] | {} 
}
