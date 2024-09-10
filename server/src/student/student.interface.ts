export interface IStudentGeneralInformation {

}

export interface IStudentEducationalBackground {
    
}

export interface IStudentTrainingAndAdvanceStudies {
    
}

export interface IStudentCourse {
    courseno: string
    units: number
}

export interface IStudentPrograms {
    code: {}
    course: IStudentCourse[]
}

export interface IStudent {
    sid?: string
    generalInformation: {}
    educationalBackground: {}
    trainingAdvanceStudies: {}
    programs: IStudentPrograms[]
    status: string
    progress: string
}

export interface IPromiseStudent {
    success: boolean
    message: string
}