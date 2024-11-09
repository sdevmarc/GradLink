interface academicYear {
    startDate: number
    endDate: number
}

interface ICurriculum {
    name?: string
    major?: string
}

export interface IAPIOffered {
    _id?: string
    code?: string
    courseno?: string
    descriptiveTitle?: string
    department?: string
    curriculum?: ICurriculum
    semester?: number
    academicYear?: academicYear
    courses?: string[]
    isActive?: boolean
}
