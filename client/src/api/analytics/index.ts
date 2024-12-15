import { HOST } from '@/constants'
import axios from 'axios'

axios.defaults.withCredentials = true;

export const API_ANALYTICS_EMPLOYMENT = async ({ department, program, academicYear }: { department?: string, program?: string, academicYear?: string }) => {
    const response = await axios.post(`${HOST}/student/employment-analytics`, {
        department, program, academicYear
    }, { withCredentials: true })
    return response.data
}

export const API_ANALYTICS_COMMON_REASONS = async ({ reason }: { reason?: string }) => {
    const response = await axios.post(`${HOST}/student/commonreasons-analytics`, {
        reason
    }, { withCredentials: true })
    return response.data
}

export const API_OVERVIEW_COURSE_RELATED = async () => {
    const response = await axios.get(`${HOST}/student/alumni-click-course-related`, { withCredentials: true })
    return response.data
}

export const API_OVERVIEW_LAND_JOB = async () => {
    const response = await axios.get(`${HOST}/student/alumni-click-land-job`, { withCredentials: true })
    return response.data
}