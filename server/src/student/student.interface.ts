export interface IStudentCourse {
    courseno?: string
    descriptive_title?: string
    units?: number
}

interface IStudentEnrollments {
    semester?: string
    progress?: string
    enrollment_date?: string
    courses?: IStudentCourse[]
}

export interface IStudent {
    sid?: string | string[]
    idNumber?: string
    name?: string
    email?: string
    generalInformation?: {}
    educationalBackground?: {}
    trainingAdvanceStudies?: {}
    enrollments?: IStudentEnrollments[]
    status?: string
    isenrolled?: boolean
    semester?: number
    
}

export interface IPromiseStudent {
    success: boolean
    message: string
    data?: IStudent[] | {}
    idNumber?: string
}