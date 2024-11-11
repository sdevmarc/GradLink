import { HOST } from '@/constants'
import { IAPIAlumni } from '@/interface/alumni.interface'
import axios from 'axios'

export const API_STUDENT_FINDALL_ALUMNI = async () => {
    const response = await axios.get(`${HOST}/student/alumni`)
    return response.data
}

export const API_STUDENT_FINDONE_ALUMNI = async ({ idNumber }: IAPIAlumni) => {
    const response = await axios.get(`${HOST}/student/findone/${idNumber}`)
    return response.data
}

export const API_STUDENT_SEND_TRACER = async () => {
    const response = await axios.post(`${HOST}/student/send-tracer-to-alumni`)
    return response.data
}