import { HOST } from '@/constants'
import axios from 'axios'

axios.defaults.withCredentials = true;

export const API_FORM_FINDALL_UNKNOWN = async () => {
    const response = await axios.get(`${HOST}/forms/unknown-respondents`,
        { withCredentials: true }
    )
    return response.data
}

export const API_FORM_MAPPED = async () => {
    const response = await axios.get(`${HOST}/forms/form-mapped`,
        { withCredentials: true }
    )
    return response.data
}