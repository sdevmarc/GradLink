export interface IStudentCourse {
    courseno: string
}

// export interface IStudentPrograms {
//     code: {}
//    course: IStudentCourse[]
// }

export interface IStudent {
    sid?: string
    idNumber?: string
    generalInformation?: {}
    educationalBackground?: {}
    trainingAdvanceStudies?: {}
    // programs?: IStudentPrograms[]
    status?: string
    progress?: string
}

export interface IPromiseStudent {
    success: boolean
    message: string
    data?: IStudent[] | {}
}