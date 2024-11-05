interface academicYear {
    startDate: number
    endDate: number
}

export interface IAPIOffered {
    semester?: number
    academicYear?: academicYear
    courses?: string[]
    isActive?: boolean
}