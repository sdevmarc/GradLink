import { HOST } from '@/constants'
import { IAPIStudents, IRequestStudents } from '@/interface/student.interface'
import axios from 'axios'

export const API_STUDENT_FINDALL = async () => {
    const response = await axios.get(`${HOST}/student`)
    return response.data
}

export const API_STUDENT_FINDONE_ALUMNI_FOR_TRACER_MAP = async ({ id }: { id: string }) => {
    const response = await axios.get(`${HOST}/student/alumni-tracer/${id}`)
    return response.data
}

export const API_STUDENT_FINDALL_ALUMNI_FOR_TRACER_MAP = async () => {
    const response = await axios.get(`${HOST}/student/alumni-for-tracer-map`)
    return response.data
}

export const API_STUDENT_FINDALL_FILTERED_ALUMNI = async ({ search, program, yeargraduated }: { search: string, program: string, yeargraduated: string }) => {
    const response = await axios.post(`${HOST}/student/filtered-alumni`, {
        search, program, yeargraduated
    })
    return response.data
}

export const API_STUDENT_YEARS_GRADUATED = async () => {
    const response = await axios.get(`${HOST}/student/years-graduated`)
    return response.data
}

export const API_STUDENT_FINDALL_ATTRITION_RATE_COURSES = async (id: string) => {
    const response = await axios.get(`${HOST}/student/attrition/${id}`)
    return response.data
}

export const API_STUDENT_FINDALL_ENROLLEES = async () => {
    const response = await axios.get(`${HOST}/student/enrollees`)
    return response.data
}

export const API_STUDENT_FINDALL_ENROLLEES_IN_COURSE = async (id: string) => {
    const response = await axios.get(`${HOST}/student/enrollees/${id}`)
    return response.data
}

export const API_STUDENT_FINDALL_EVALUATEES_IN_COURSE = async (id: string) => {
    const response = await axios.get(`${HOST}/student/evaluation/${id}`)
    return response.data
}

export const API_STUDENT_FINDALL_CURRENTLY_ENROLLED = async () => {
    const response = await axios.get(`${HOST}/student/currently-enrolled`)
    return response.data
}

export const API_STUDENT_NEW_STUDENT = async ({ idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements }: IAPIStudents) => {
    const response = await axios.post(`${HOST}/student/new-student`, {
        idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements
    })
    return response.data
}

export const API_STUDENT_ENROLL_STUDENT = async ({ course, id }: IRequestStudents) => {
    const response = await axios.post(`${HOST}/student/enroll-student`, {
        course, id
    })
    return response.data
}

export const API_STUDENT_ACTIVATE_STUDENT = async ({ id }: IRequestStudents) => {
    const response = await axios.post(`${HOST}/student/activate-student`, {
        studentid: id
    })
    return response.data
}

export const API_STUDENT_DISCONTINUE_STUDENT = async (formData: FormData) => {
    const response = await axios.post(`${HOST}/student/discontinue-student`, formData)
    return response.data
}

export const API_STUDENT_EVALUATE_STUDENT = async ({ course, evaluations }: IRequestStudents) => {
    const response = await axios.post(`${HOST}/student/evaluate-student`, {
        course, evaluations
    })
    return response.data
}