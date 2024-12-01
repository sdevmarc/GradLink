import { HOST } from '@/constants'
import { ICurriculum } from '@/interface/curriculum.interface'
import axios from 'axios'

axios.defaults.withCredentials = true;

export const API_CURRICULUM_FINDALL = async () => {
    try {
        const response = await axios.get(`${HOST}/curriculum`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_CURRICULUM_FINDALL_ACTIVE = async () => {
    try {
        const response = await axios.get(`${HOST}/curriculum/active`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_NEW_CURRICULUM = async ({ name, year, programid, major, categories, department }: ICurriculum) => {
    try {
        const response = await axios.post(`${HOST}/curriculum/create`, { name, year, programid, major, categories, department },
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}