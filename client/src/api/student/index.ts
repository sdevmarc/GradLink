import { HOST } from '@/constants'
import { IAPIStudents, IRequestStudents } from '@/interface/student.interface'
import axios from 'axios'

axios.defaults.withCredentials = true;

export const API_STUDENT_FINDALL = async () => {
    const response = await axios.get(`${HOST}/student`,
        { withCredentials: true }
    )
    return response.data
}

export const API_STUDENT_FINDONE = async ({ id }: { id: string }) => {
    const response = await axios.get(`${HOST}/student/details/${id}`,
        { withCredentials: true }
    )
    return response.data
}

export const API_STUDENT_FINDONE_ALUMNI_FOR_TRACER_MAP = async ({ id }: { id: string }) => {
    const response = await axios.get(`${HOST}/student/alumni-tracer/${id}`,
        { withCredentials: true }
    )
    return response.data
}

export const API_STUDENT_FINDALL_ALUMNI_FOR_TRACER_MAP = async () => {
    const response = await axios.get(`${HOST}/student/alumni-for-tracer-map`,
        { withCredentials: true }
    )
    return response.data
}

export const API_STUDENT_FINDALL_FILTERED_ALUMNI = async ({ search, program, yeargraduated }: { search: string, program: string, yeargraduated: string }) => {
    const response = await axios.post(`${HOST}/student/filtered-alumni`, {
        search, program, yeargraduated
    }, { withCredentials: true })
    return response.data
}

export const API_STUDENT_YEARS_GRADUATED = async () => {
    const response = await axios.get(`${HOST}/student/years-graduated`,
        { withCredentials: true }
    )
    return response.data
}

export const API_STUDENT_FINDALL_ATTRITION_RATE_COURSES = async (id: string) => {
    const response = await axios.get(`${HOST}/student/attrition/${id}`,
        { withCredentials: true }
    )
    return response.data
}

export const API_STUDENT_FINDALL_ENROLLEES = async () => {
    const response = await axios.get(`${HOST}/student/enrollees`,
        { withCredentials: true }
    )
    return response.data
}

export const API_STUDENT_FINDALL_ENROLLEES_IN_COURSE = async (id: string) => {
    const response = await axios.get(`${HOST}/student/enrollees/${id}`,
        { withCredentials: true }
    )
    return response.data
}

export const API_STUDENT_FINDALL_EVALUATEES_IN_COURSE = async (id: string) => {
    const response = await axios.get(`${HOST}/student/evaluation/${id}`,
        { withCredentials: true }
    )
    return response.data
}

export const API_STUDENT_FINDALL_CURRENTLY_ENROLLED = async () => {
    const response = await axios.get(`${HOST}/student/currently-enrolled`,
        { withCredentials: true }
    )
    return response.data
}

export const API_STUDENT_NEW_STUDENT = async ({ idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements }: IAPIStudents) => {
    const response = await axios.post(`${HOST}/student/new-student`, {
        idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements
    }, { withCredentials: true })
    return response.data
}

export const API_STUDENT_ENROLL_STUDENT = async ({ course, id }: IRequestStudents) => {
    const response = await axios.post(`${HOST}/student/enroll-student`, {
        course, id
    }, { withCredentials: true })
    return response.data
}

export const API_STUDENT_ACTIVATE_STUDENT = async ({ id }: IRequestStudents) => {
    const response = await axios.post(`${HOST}/student/activate-student`, {
        studentid: id
    }, { withCredentials: true })
    return response.data
}

export const API_STUDENT_DISCONTINUE_STUDENT = async (formData: FormData) => {
    const response = await axios.post(`${HOST}/student/discontinue-student`, formData,
        { withCredentials: true }
    )
    return response.data
}

export const API_STUDENT_EVALUATE_STUDENT = async ({ course, evaluations }: IRequestStudents) => {
    const response = await axios.post(`${HOST}/student/evaluate-student`, {
        course, evaluations
    }, { withCredentials: true })
    return response.data
}

export const API_STUDENT_UPDATE_STUDENT = async ({ id, lastname, middlename, firstname, undergraduateInformation }: { id: string, lastname: string, middlename: string, firstname: string, undergraduateInformation: string }) => {
    const response = await axios.post(`${HOST}/student/update-student`, {
        id, lastname, middlename, firstname, undergraduateInformation
    }, { withCredentials: true })
    return response.data
}

export const API_STUDENT_UPDATE_STUDENT_SHIFT_STUDENT = async ({ id, idNumber, program }: { id: string, idNumber: string, program: string }) => {
    const response = await axios.post(`${HOST}/student/shift-student`, {
        id, idNumber, program
    }, { withCredentials: true })
    return response.data
}