import { HOST } from '@/constants'
import axios from 'axios'

axios.defaults.withCredentials = true;

export const API_ANALYTICS_EMPLOYMENT = async ({ department, program, academicYear }: { department?: string, program?: string, academicYear?: string }) => {
    const response = await axios.post(`${HOST}/student/employment-analytics`, {
        department, program, academicYear
    }, { withCredentials: true })
    return response.data
}