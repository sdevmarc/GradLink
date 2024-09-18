interface IEnrollments {
    courseno?: string
    descriptive_title?: string
    units?: number
}

export interface IAPIStudents {
    sid?: string
    idNumber?: string
    name?: string
    email?: string
    status?: string
    semester?: string
    enrollments?: IEnrollments[]
}