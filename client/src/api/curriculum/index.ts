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

// export const API_CURRICULUM_FINDALL_LEGACY = async () => {
//     try {
//         const response = await axios.get(`${HOST}/curriculum/legacy`)
//         return response.data
//     } catch (error) {
//         console.error(error)
//     }
// }

export const API_NEW_CURRICULUM = async ({ name, programCode, major, categories }: IRequestCurriculum) => {
    try {
        const response = await axios.post(`${HOST}/curriculum/create`, { name, programCode, major, categories })
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