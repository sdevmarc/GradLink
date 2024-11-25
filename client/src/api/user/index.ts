import { HOST } from '@/constants'
import { IAPIUsers } from '@/interface/user.interface';
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

export const API_USER_GET_ALL_USERS = async () => {
    const response = await axios.get(`${HOST}/users`,
        { withCredentials: true }
    )
    return response.data
}

export const API_USER_UPDATE_INFORMATION = async ({ userid, name, email }: IAPIUsers) => {
    const response = await axios.post(`${HOST}/users/update-information`,
        { id: userid, name, email },
        { withCredentials: true }
    )
    return response.data
}

export const API_USER_CHECK_PASSWORD = async ({ userid, password }: IAPIUsers) => {
    const response = await axios.post(`${HOST}/users/check-password`,
        { id: userid, password },
        { withCredentials: true }
    )
    return response.data
}

export const API_USER_CHANGE_PASSWORD = async ({ userid, password }: IAPIUsers) => {
    const response = await axios.post(`${HOST}/users/change-password`,
        { id: userid, password },
        { withCredentials: true }
    )
    return response.data
}

export const API_USER_CHANGE_FORGOT_PASSWORD = async ({ email, password }: IAPIUsers) => {
    const response = await axios.post(`${HOST}/users/change-forgot-password`,
        { email, password },
        { withCredentials: true }
    )
    return response.data
}

export const API_USER_CREATE_USER = async ({ email, name, role }: IAPIUsers) => {
    const response = await axios.post(`${HOST}/users/create`,
        { email, name, role },
        { withCredentials: true }
    )
    return response.data
}

export const API_USER_UPDATE_USER = async ({ userid, email, name, role, department }: IAPIUsers) => {
    const response = await axios.post(`${HOST}/users/update`,
        { id: userid, email, name, role, department },
        { withCredentials: true }
    )
    return response.data
}

export const API_USER_UPDATE_STATUS_USER = async ({ userid, isactive }: IAPIUsers) => {
    const response = await axios.post(`${HOST}/users/update-status`,
        { id: userid, isactive },
        { withCredentials: true }
    )
    return response.data
}