
interface IStudentEnrollments {
    course?: string[]
    enrollmentDate?: string
    ispass?: 'pass' | 'fail' | 'inc' | 'ongoing' | 'drop' | 'discontinue'
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
    id?: string
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
    assessmentForm?: string
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
    evaluations?: IEvaluationItem[];
}

export interface IPromiseStudent {
    success: boolean
    message: string
    data?: IStudent[] | {}
    idNumber?: string
}