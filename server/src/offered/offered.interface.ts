interface academicYear {
    startDate: number
    endDate: number
}

export interface IOffered {
    semester?: number
    academicYear?: academicYear
    courses: string[]
    isActive?: boolean
}

export interface IPromiseOffered {
    success: boolean
    message: string
    data?: [] | {}
}
