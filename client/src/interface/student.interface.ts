interface IStudentCourses {
    courseno: string
}

interface IStudentAcademicYear {
    from: string
    to: string
}

interface IEnrollments {
    semester?: number
    progress?: string
    academic_year?: IStudentAcademicYear
    courses?: IStudentCourses[]
}

export interface IAPIStudents {
    sid?: string
    idNumber?: string
    name?: string
    email?: string
    status?: string
    enrollments?: IEnrollments[]
}