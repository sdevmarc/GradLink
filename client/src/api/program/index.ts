import { HOST } from '@/constants'
import { IRequestPrograms } from '@/interface/program.interface'
import axios from 'axios'

export const API_PROGRAM_FINDALL = async () => {
    try {
        const response = await axios.get(`${HOST}/programs`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

// export const API_PROGRAM_FINDONE = async ({ code }: IAPIPrograms) => {
//     try {
//         const response = await axios.get(`${HOST}/programs/${code}`)
//         return response.data
//     } catch (error) {
//         console.error(error)
//     }
// }

export const API_PROGRAM_ADD_PROGRAM = async ({ programs }: IRequestPrograms) => {
    try {
        const response = await axios.post(`${HOST}/programs/add-program-to-active-curriculum`, { programs })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

// export const API_PROGRAM_UPDATE = async ({ pid, code, descriptiveTitle, residency }: IAPIPrograms) => {
//     try {
//         const response = await axios.post(`${HOST}/programs/update`, {
//             pid, code, descriptiveTitle, residency
//         })

//         return response.data
//     } catch (error) {
//         console.error(error)
//     }
// }

// export const API_PROGRAM_DELETE = async ({ pid }: IAPIPrograms) => {
//     try {
//         const response = await axios.get(`${HOST}/programs/${pid}`)
//         return response.data
//     } catch (error) {
//         console.error(error)
//     }
// }