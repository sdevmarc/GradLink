export interface ICourses {
    courseno?: string
    descriptive_title?: string
    units?: number
}

interface IEnrollments {
    courses?: ICourses[]
    semester?: string
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
    enrollments?: IEnrollments
}

export interface IRequestStudents {
    course: string
    id: string[]
}