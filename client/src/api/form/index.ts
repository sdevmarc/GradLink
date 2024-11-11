import { HOST } from '@/constants'
import axios from 'axios'

export const API_FORM_FINDALL_UNKNOWN = async () => {
    const response = await axios.get(`${HOST}/forms/unknown-respondents`)
    return response.data
}

export const API_FORM_MAPPED = async () => {
    const response = await axios.get(`${HOST}/forms/form-mapped`)
    return response.data
}