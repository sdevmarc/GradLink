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
    STUDENT_ENROLLEE: '/enrollment/student-enrollees',
    CREATE_COURSE_OFFERED: '/enrollment/create-course-offered',
    CURRENTLY_ENROLLED: '/enrollment/current-enrolled',
    NEW_STUDENT: '/enrollment/new-student',

    //STUDENT
    LIST_OF_STUDENTS: '/student',
    ALUMNI_GRADUATES: '/student/alumni',
    CREATE_STUDENT: '/student/create',

    //PROGRAM
    AVAILABLE_PROGRAMS: '/program',
    AVAILABLE_COURSES: '/program/courses',
    CREATE_PROGRAM: '/program/program/create',
    CREATE_COURSE: '/program/courses/create',
    CURRICULUM: '/program/curriculum',
    CREATE_CURRICULUM: '/program/curriculum/create',

    GOOGLE_FORM: '/form'
}