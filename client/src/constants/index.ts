const { VITE_API_HOST } = import.meta.env

export const HOST = VITE_API_HOST

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    OVERVIEW: '/overview',
    TRACER: '/tracer',
    CURRENTLY_ENROLLED: '/student',
    LIST_OF_STUDENTS: '/student/lists',
    ALUMNI_GRADUATES: '/student/alumni',
    CREATE_STUDENT: '/student/create',
    AVAILABLE_PROGRAMS: '/program',
    AVAILABLE_COURSES: '/program/courses',
    GOOGLE_FORM: '/form'
}