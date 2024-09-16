export interface IStudentCourse {
    courseno?: string
    descriptive_title?: string
    units?: number
}

interface IStudentEnrollments {
    semester?: string
    progress?: string
    year?: string
    courses?: IStudentCourse[]
}

export interface IStudent {
    sid?: string
    idNumber?: string
    name?: string
    email?: string
    generalInformation?: {}
    educationalBackground?: {}
    trainingAdvanceStudies?: {}
    enrollments?: IStudentEnrollments[]
    status?: string
    progress?: string
}

export interface IStudentFormPending {
    sid: string
    status: string
}

export interface IPromiseStudent {
    success: boolean
    message: string
    data?: IStudent[] | {}
    idNumber?: string
}