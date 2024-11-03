import { HOST } from '@/constants'
import { ICurriculum } from '@/interface/curriculum.interface'
import axios from 'axios'

export const API_CURRICULUM_FINDALL = async () => {
    try {
        const response = await axios.get(`${HOST}/curriculum`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_CURRICULUM_FINDALL_ACTIVE = async () => {
    try {
        const response = await axios.get(`${HOST}/curriculum/active`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_NEW_CURRICULUM = async ({ name, programid, major, categories, department }: ICurriculum) => {
    try {
        const response = await axios.post(`${HOST}/curriculum/create`, { name, programid, major, categories, department })
        return response.data
    } catch (error) {
        console.error(error)
    }
}