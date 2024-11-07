
interface IStudentEnrollments {
    course?: string[]
    enrollmentDate?: string
    ispass?: 'pass' | 'fail' | 'inc' | 'ongoing' | 'drop' | 'discontinue'
    assessmentForm?: string
}

interface IUndergraduateInformation {
    college?: string
    school?: string
    programGraduated?: string
    yearGraduated?: string
}

interface IAchievements {
    awards?: string
    examPassed?: string
    examDate?: string
    examRating?: string
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
    employmentData?: {}
    enrollments?: IStudentEnrollments[]
    status?: string
    isenrolled?: boolean
    program?: string
    courses?: string[]
    undergraduateInformation?: IUndergraduateInformation
    achievements?: IAchievements
}

export interface IEvaluationItem {
    id?: string;
    ispass?: 'pass' | 'fail' | 'inc' | 'ongoing' | 'drop' | 'discontinue';
    file?: string;
}

export interface IRequestStudent {
    id?: string[]
    course?: string;
    evaluation?: IEvaluationItem[];
}

export interface IPromiseStudent {
    success: boolean
    message: string
    data?: IStudent[] | {}
    idNumber?: string
}