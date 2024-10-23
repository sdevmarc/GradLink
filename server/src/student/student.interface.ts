
interface IStudentEnrollments {
    semester?: string
    course?: string[]
    enrollmentDate?: string
    ispass?:  boolean
}

export interface IStudent {
    _id?: string | string[]
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