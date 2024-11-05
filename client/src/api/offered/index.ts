import { HOST } from '@/constants'
import { IAPIOffered } from '@/interface/offered.interface'
import axios from 'axios'

export const API_FINDALL_COURSES_OFFERED = async () => {
    try {
        const response = await axios.get(`${HOST}/offered`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_CREATE_COURSES_OFFERED = async ({ courses, semester, academicYear }: IAPIOffered) => {
    try {
        const response = await axios.post(`${HOST}/offered/create`, {
            courses, semester, academicYear
        })

        return response.data
    } catch (error) {
        console.error(error)
    }
}