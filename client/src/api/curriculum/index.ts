import { HOST } from '@/constants'
import axios from 'axios'

export const API_CURRICULUM_FINDALL = async () => {
    try {
        const response = await axios.get(`${HOST}/curriculum`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}