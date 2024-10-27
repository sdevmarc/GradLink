import { HOST } from '@/constants'
import { IAPIStudents, IRequestStudents } from '@/interface/student.interface'
import axios from 'axios'

export const API_STUDENT_FINDALL = async () => {
    const response = await axios.get(`${HOST}/student`)
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

export const API_STUDENT_FINDALL_CURRENTLY_ENROLLED = async () => {
    const response = await axios.get(`${HOST}/student/currently-enrolled`)
    return response.data
}

export const API_STUDENT_NEW_STUDENT = async ({ idNumber, lastname, firstname, middlename, email, program }: IAPIStudents) => {
    const response = await axios.post(`${HOST}/student/new-student`, {
        idNumber, lastname, firstname, middlename, email, program
    })
    return response.data
}

export const API_STUDENT_ENROLL_STUDENT = async ({ course, id }: IRequestStudents) => {
    const response = await axios.post(`${HOST}/student/enroll-student`, {
        course, id
    })
    return response.data
}