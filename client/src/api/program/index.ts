import { HOST } from '@/constants'
import { IAPIPrograms } from '@/interface/program.interface'
import axios from 'axios'

axios.defaults.withCredentials = true;

export const API_PROGRAM_FINDALL = async () => {
    try {
        const response = await axios.get(`${HOST}/programs`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_PROGRAM_ATTRITION = async ({ id }: { id: string }) => {
    try {
        const response = await axios.get(`${HOST}/programs/attrition-calculate/${id}`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_PROGRAM_FINDONE = async ({ _id }: IAPIPrograms) => {
    try {
        const baseId = btoa(_id || '')
        const response = await axios.get(`${HOST}/programs/attrition-calculate/${baseId}`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_PROGRAM_NEW_PROGRAM = async ({ code, descriptiveTitle, residency, department }: IAPIPrograms) => {
    try {
        const response = await axios.post(`${HOST}/programs/create`, { code, descriptiveTitle, residency, department },
            { withCredentials: true }
        )
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