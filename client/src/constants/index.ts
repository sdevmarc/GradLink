const { VITE_API_HOST, VITE_API_MAP_DEV } = import.meta.env

export const HOST = VITE_API_HOST
export const MAPKEY = VITE_API_MAP_DEV

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    OVERVIEW: '/overview',

    //TRACER
    TRACER: '/tracer',

    //ENROLLMENT
    ENROLLMENT: '/enrollment',
    ENROLLMENT_ATTRITION_RATE_COURSES: '/enrollment/attrition-rate-courses',
    ENROLLMENT_ATTRITION_RATE_PROGRAMS: '/enrollment/attrition-rate-programs',
    CREATE_COURSE_OFFERED: '/enrollment/create-course-offered',
    NEW_STUDENT: '/enrollment/new-student',

    //STUDENT
    LIST_OF_STUDENTS: '/student',
    CREATE_STUDENT: '/student/create',

    //ALUMNI
    ALUMNI: '/alumni',
    TRACER_MAP: '/alumni/tracer',


    //PROGRAM
    PROGRAMS: '/program',
    CREATE_PROGRAM: '/program/create-program',
    CREATE_COURSE: '/program/create-course',
    CREATE_CURRICULUM: '/program/create-curriculum',

    GOOGLE_FORM: '/form'
}