import { HOST } from '@/constants'
import axios from 'axios'

export const API_FINDALL_COURSES_OFFERED = async () => {
    try {
        const response = await axios.get(`${HOST}/offered`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}