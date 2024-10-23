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

export const API_COURSE_CREATE = async ({ courseno, descriptiveTitle, units, prerequisites }: IAPICourse) => {
    try {
        const response = await axios.post(`${HOST}/courses/create`, {
            courseno, descriptiveTitle, units, prerequisites
        })

        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_COURSE_UPDATE = async ({ _id, courseno, descriptiveTitle, programs, units }: IAPICourse) => {
    try {
        const response = await axios.post(`${HOST}/courses/update`, {
            _id, courseno, descriptiveTitle, programs, units
        })

        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_COURSE_DELETE = async ({ _id }: IAPICourse) => {
    try {
        const response = await axios.get(`${HOST}/course/${_id}`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}