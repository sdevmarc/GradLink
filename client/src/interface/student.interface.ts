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
    email?: string
    status?: string
    enrollments?: IEnrollments
    isenrolled?: boolean
}