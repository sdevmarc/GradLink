interface IPrerequisite {
    _id: string
}

interface IPrograms {
    _id: string
}

export interface IAPICourse {
    _id?: string
    code?: string
    courseno?: string
    descriptiveTitle?: string
    programs?: IPrograms[]
    units?: number
    prerequisites?: IPrerequisite[]
}

export interface IRequestUpdateCourse {
    id: string[]
}