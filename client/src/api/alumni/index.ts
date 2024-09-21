import { HOST } from '@/constants'
import axios from 'axios'

export const API_STUDENT_FINDALL_ALUMNI = async () => {
    const response = await axios.get(`${HOST}/student/alumni`)
    return response.data
}