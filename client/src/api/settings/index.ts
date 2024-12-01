import { HOST } from '@/constants'
import { IAPISettings } from '@/interface/settings.interface';
import axios from 'axios'

axios.defaults.withCredentials = true;

export const API_FINDONE_SETTINGS = async () => {
    try {
        const response = await axios.get(`${HOST}/settings`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_UPDATE_SETTINGS = async ({ isenroll }: IAPISettings) => {
    try {
        const response = await axios.post(`${HOST}/settings/update-settings`, {
            isenroll
        }, { withCredentials: true })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_GET_AUDIT_LOGS = async () => {
    try {
        const response = await axios.get(`${HOST}/auditlog`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_GET_RESTORE = async () => {
    try {
        const response = await axios.get(`${HOST}/settings/restore`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const checkAuthStatus = async () => {
    try {
        const response = await axios.get(`${HOST}/auth/status`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error(error)
        return { isAuthenticated: false };
    }
};

export const API_SETTINGS_SEND_OTP = async ({ email }: { email: string }) => {
    try {
        const response = await axios.post(`${HOST}/users/otp`, {
            email
        }, { withCredentials: true })
        return response.data
    } catch (error) {
        console.error(error)
    }
};

export const VerifyOtp = async ({ otp }: { otp: number }) => {
    try {
        const response = await axios.post(`${HOST}/users/verify-otp`, {
            otp
        }, { withCredentials: true });

        return response.data;
    } catch (error) {
        console.error(error)
    }
};