export interface IAPIPrograms {
    _id?: string
    code?: string
    descriptiveTitle?: string
    residency?: string
    curriculumId?: string
}

export interface IRequestPrograms {
    programs: IAPIPrograms[]
}