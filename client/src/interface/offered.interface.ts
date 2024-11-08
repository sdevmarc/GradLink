interface academicYear {
    startDate: number
    endDate: number
}

export interface IAPIOffered {
    _id?: string
    code?: string
    courseno?: string
    descriptiveTitle?: string
    semester?: number
    academicYear?: academicYear
    courses?: string[]
    isActive?: boolean
}