
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
    curriculumid?: string
    evaluation?: string;
    ispass?: string
    status?: string
}