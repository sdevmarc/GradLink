const { VITE_API_HOST } = import.meta.env

export const HOST = VITE_API_HOST

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    OVERVIEW: '/overview',
    TRACER: '/tracer',
    REGISTERED_STUDENTS: '/student',
    ALUMNI_GRADUATES: '/student/alumni',
    CREATE_STUDENT: '/student/create',
    REGISTERED_PROGRAMS: '/program',
    REGISTERED_COURSES: '/program/courses',
    GOOGLE_FORM: '/form'
}