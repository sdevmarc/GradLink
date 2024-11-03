
interface IStudentEnrollments {
    course?: string[]
    enrollmentDate?: string
    ispass?: 'pass' | 'fail' | 'inc' | 'ongoing' | 'drop' | 'discontinue'
}

export interface IStudent {
    _id?: string | string[]
    idNumber?: string
    lastname?: string
    firstname?: string
    middlename?: string
    email?: string
    generalInformation?: {}
    educationalBackground?: {}
    trainingAdvanceStudies?: {}
    enrollments?: IStudentEnrollments[]
    status?: string
    isenrolled?: boolean
    program?: string
    courses?: string[]
}

export interface IRequestStudent {
    course: string
    id: string[]
    ispass?: 'pass' | 'fail' | 'inc' | 'ongoing' | 'drop' | 'discontinue'
}

export interface IPromiseStudent {
    success: boolean
    message: string
    data?: IStudent[] | {}
    idNumber?: string
}