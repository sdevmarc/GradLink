import { HOST } from '@/constants'
import { IAPIStudents } from '@/interface/student.interface'
import axios from 'axios'

export const API_STUDENT_FINDALL = async () => {
    const response = await axios.get(`${HOST}/student`)
    return response.data
}

export const API_STUDENT_FINDALL_ENROLLED = async () => {
    const response = await axios.get(`${HOST}/student/enrolled`)
    return response.data
}

export const API_STUDENT_CREATE = async ({ idNumber, name, email, enrollments, isenrolled = true }: IAPIStudents) => {
    const response = await axios.post(`${HOST}/student/create`, {
        idNumber, name, email, enrollments, isenrolled
    })
    return response.data
}