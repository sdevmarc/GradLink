
interface IStudentEnrollments {
    course?: string[]
    enrollmentDate?: string
    ispass?: 'pass' | 'fail' | 'inc' | 'ongoing' | 'drop' | 'discontinue'
    assessmentForm?: string
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

export interface IEvaluationItem {
    id?: string;
    ispass?: 'pass' | 'fail' | 'inc' | 'ongoing' | 'drop' | 'discontinue';
    file?: string;
}

export interface IRequestStudent {
    id?: string[]
    course: string;
    evaluation: IEvaluationItem[];
}

export interface IPromiseStudent {
    success: boolean
    message: string
    data?: IStudent[] | {}
    idNumber?: string
}