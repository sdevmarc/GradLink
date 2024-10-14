import { IPrograms } from "src/programs/programs.interface"

interface IPrerequisite {
    courseno: string
}

export interface ICourses {
    cid?: string
    courseno?: string
    descriptiveTitle?: string
    programs?: IPrograms[]
    units?: number
    prerequisites?: IPrerequisite[]
}

export interface IPromiseCourse {
    success: boolean
    message: string
    data?: ICourses[] | {}
}
