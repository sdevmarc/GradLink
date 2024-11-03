const { VITE_API_HOST } = import.meta.env

export const HOST = VITE_API_HOST

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    OVERVIEW: '/overview',

    //TRACER
    TRACER: '/tracer',

    //ENROLLMENT
    ENROLLMENT: '/enrollment',
    CREATE_COURSE_OFFERED: '/enrollment/create-course-offered',
    NEW_STUDENT: '/enrollment/new-student',

    //STUDENT
    LIST_OF_STUDENTS: '/student',
    CREATE_STUDENT: '/student/create',

    //PROGRAM
    PROGRAMS: '/program',
    CREATE_PROGRAM: '/program/create-program',
    CREATE_COURSE: '/program/create-course',
    CREATE_CURRICULUM: '/program/create-curriculum',

    GOOGLE_FORM: '/form'
}