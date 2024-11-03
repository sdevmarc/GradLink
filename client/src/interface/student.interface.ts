interface IEnrollments {
    course?: string
}

interface IAcademicYear {
    startDate?: number
    endDate?: number
}

interface ICourses {
    _id?: string
    code?: number
    courseno?: string
    descriptiveTitle?: string
    units?: 3,
    enrollmentDate?: string
    status?: string
    semester?: number
    academicYear?: IAcademicYear
}


interface IEnrolledCourses {
    courses?: ICourses[]
    academicYear?: IAcademicYear
}

export interface IAPIStudents {
    _id?: string
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
    units?: string
    totalOfUnitsEarned?: number
    totalOfUnitsEnrolled?: number
    enrolledCourses?: IEnrolledCourses[]
    progress?: string
    programCode?: string
    programName?: string
    department?: string
    isenrolled?: string
}

export interface IRequestStudents {
    course: string
    id: string[]
}