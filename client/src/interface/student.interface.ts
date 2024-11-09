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
    enrolledCourses?: ICourses[]
    progress?: string
    programCode?: string
    programName?: string
    department?: string
    isenrolled?: string
    undergraduateInformation?: IUndergraduateInformation
    achievements?: IAchievements
}

export interface IEvaluation {
    id: string;
    ispass: string;
    file?: File | null;
    preview?: string | null; // URL for preview
}

export interface IRequestStudents {
    id?: string
    course?: string
    evaluations?: IEvaluation[]
}