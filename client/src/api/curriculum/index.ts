import { HOST } from '@/constants'
import { IRequestCurriculum } from '@/interface/curriculum.interface'
import axios from 'axios'

export const API_CURRICULUM_FINDALL = async () => {
    try {
        const response = await axios.get(`${HOST}/curriculum`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_PROGRAM_ADD_NEW_CURRICULUM = async ({ name, programs }: IRequestCurriculum) => {
    try {
        const response = await axios.post(`${HOST}/programs/create`, { name, programs })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_CURRICULUM_ISEXISTS = async () => {
    const response = await axios.get(`${HOST}/curriculum/check-curriculum`)
    return response.data
}

export const API_SEMESTER_ISEXISTS = async () => {
    const response = await axios.get(`${HOST}/semester/check-semester`)
    return response.data
}