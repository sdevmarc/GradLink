import { HOST } from '@/constants'
import axios from 'axios'

export const API_FINDONE_SETTINGS = async () => {
    try {
        const response = await axios.get(`${HOST}/settings`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_UPDATE_SETTINGS = async ({ isenroll }: IAPISettings) => {
    try {
        const response = await axios.post(`${HOST}/settings/update-settings`, {
            isenroll
        })
        return response.data
    } catch (error) {
        console.error(error)
    }
}