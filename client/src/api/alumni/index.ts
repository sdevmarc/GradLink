import { HOST } from '@/constants'
import { IAPIAlumni } from '@/interface/alumni.interface'
import axios from 'axios'

axios.defaults.withCredentials = true;

export const API_STUDENT_FINDALL_ALUMNI = async () => {
    const response = await axios.get(`${HOST}/student/alumni`,
        { withCredentials: true })
    return response.data
}

export const API_STUDENT_FINDONE_ALUMNI = async ({ idNumber }: IAPIAlumni) => {
    const response = await axios.get(`${HOST}/student/findone/${idNumber}`,
        { withCredentials: true })
    return response.data
}

export const API_STUDENT_SEND_TRACER = async ({ academicYear, program }: { academicYear: string, program: string }) => {
    const response = await axios.post(`${HOST}/student/send-tracer-to-alumni`, {
        academicYear, program
    },
        { withCredentials: true })
    return response.data
}

export const API_STUDENT_SEND_TRACER_TO_ONE = async ({ email }: { email: string }) => {
    const response = await axios.post(`${HOST}/mail/one-alumni`, {
        email
    },
        { withCredentials: true })
    return response.data
}

export const API_STUDENT_UPDATE_ALUMNI_EMAIL = async ({ id, email }: { id: string, email: string }) => {
    const response = await axios.post(`${HOST}/student/update-alumni-email`, {
        id, email
    },
        { withCredentials: true })
    return response.data
}