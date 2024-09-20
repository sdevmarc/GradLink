import { HOST } from '@/constants'
import { IAPICourse } from '@/interface/course.interface'
import axios from 'axios'

export const API_COURSE_FINDALL = async () => {
    try {
        const response = await axios.get(`${HOST}/courses`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_COURSE_FINDONE = async ({ courseno }: IAPICourse) => {
    try {
        const response = await axios.get(`${HOST}/courses/${courseno}`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_COURSE_CREATE = async ({ courseno, descriptiveTitle, degree, units, pre_req }: IAPICourse) => {
    try {
        const response = await axios.post(`${HOST}/courses/create`, {
            courseno, descriptiveTitle, degree, units, pre_req
        })

        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_COURSE_UPDATE = async ({ cid, courseno, descriptiveTitle, degree, units }: IAPICourse) => {
    try {
        const response = await axios.post(`${HOST}/courses/update`, {
            cid, courseno, descriptiveTitle, degree, units
        })

        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_COURSE_DELETE = async ({ cid }: IAPICourse) => {
    try {
        const response = await axios.get(`${HOST}/course/${cid}`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}