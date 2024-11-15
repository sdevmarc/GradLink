import { HOST } from '@/constants'
import axios from 'axios'

axios.defaults.withCredentials = true;

export const API_USER_LOGIN = async ({ email, password }: { email: string, password: string }) => {
    const response = await axios.post(`${HOST}/users/login-user`,
        { email, password },
        { withCredentials: true }
    )
    return response.data
}

export const API_USER_LOGOUT = async () => {
    const response = await axios.post(`${HOST}/users/logout`,
        { withCredentials: true }
    )
    return response.data
}

export const API_USER_GET_USER = async () => {
    const response = await axios.get(`${HOST}/users/get-user`,
        { withCredentials: true }
    )
    return response.data
}