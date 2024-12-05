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
    ENROLLMENT_ARCHIVED_ACADEMIC_YEAR_OFFERED_COURSES:'/enrollment/archived-academic-year-courses-offered',
    ENROLLMENT_ATTRITION_RATE_COURSES: '/enrollment/attrition-rate-courses',
    ENROLLMENT_ATTRITION_RATE_PROGRAMS: '/enrollment/attrition-rate-programs',
    CREATE_COURSE_OFFERED: '/enrollment/create-course-offered',
    UPDATE_COURSE_OFFERED: '/enrollment/update-course-offered',

    //STUDENT
    LIST_OF_STUDENTS: '/student',
    CREATE_STUDENT: '/student/create',
    NEW_STUDENT: '/student/new-student',

    //ALUMNI
    ALUMNI: '/alumni',
    TRACER_MAP: '/alumni/tracer',
    GOOGLE_FORM: '/alumni/google-form',
    ALUMNI_REJECTS: '/alumni/google-form/rejects',


    //PROGRAM
    PROGRAMS: '/program',
    CREATE_PROGRAM: '/program/create-program',
    CREATE_COURSE: '/program/create-course',
    CREATE_CURRICULUM: '/program/create-curriculum',

    //SETTINGS
    GENERAL_SETTINGS: '/account',
    AUDIT_LOG: '/audit-log',
    SECURITY: '/account/security',

    // GOOGLE_FORM: '/form'
}