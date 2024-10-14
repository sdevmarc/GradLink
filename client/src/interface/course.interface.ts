interface IPrerequisite {
    _id: string
}

interface IPrograms {
    _id: string
}

export interface IAPICourse {
    _id?: string
    courseno?: string
    descriptiveTitle?: string
    programs?: IPrograms[]
    units?: string | ''
    prerequisites?: IPrerequisite[]
}