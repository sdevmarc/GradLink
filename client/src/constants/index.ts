const { VITE_API_HOST } = import.meta.env

export const HOST = VITE_API_HOST

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    OVERVIEW: '/overview',
    TRACER: '/tracer',
    ENROLLMENT: '/enrollment',
    CREATE_COURSE_OFFERED: '/enrollment/create-course-offered',
    CURRENTLY_ENROLLED: '/student',
    LIST_OF_STUDENTS: '/student/lists',
    ALUMNI_GRADUATES: '/student/alumni',
    CREATE_STUDENT: '/student/create',
    AVAILABLE_PROGRAMS: '/program',
    AVAILABLE_COURSES: '/program/courses',
    CREATE_PROGRAM: '/program/program/create',
    CREATE_COURSE: '/program/courses/create',
    CURRICULUM: '/program/curriculum',
    CREATE_CURRICULUM: '/program/curriculum/create',
    GOOGLE_FORM: '/form'
}