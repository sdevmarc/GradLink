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

export const API_STUDENT_NEW_STUDENT = async ({ idNumber, lastname, firstname, middlename, email }: IAPIStudents) => {
    const response = await axios.post(`${HOST}/student/new-student`, {
        idNumber, lastname, firstname, middlename, email
    })
    return response.data
}