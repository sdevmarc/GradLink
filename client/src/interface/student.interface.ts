interface IEnrollments {
    course?: string
}

export interface IAPIStudents {
    sid?: string
    idNumber?: string
    name?: string
    lastname?: string
    firstname?: string
    middlename?: string
    email?: string
    status?: string
    enrollments?: IEnrollments[]
    program?: string
    courses?: string[]
}

export interface IRequestStudents {
    course: string
    id: string[]
}