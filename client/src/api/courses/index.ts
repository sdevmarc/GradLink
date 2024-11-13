import { HOST } from '@/constants'
import { IAPICourse } from '@/interface/course.interface'
import axios from 'axios'

axios.defaults.withCredentials = true;

export const API_COURSE_FINDALL = async () => {
    try {
        const response = await axios.get(`${HOST}/courses`,
            { withCredentials: true })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_COURSE_FINDALL_COURSES_IN_NEW_STUDENT = async ({ curriculumid }: IAPICourse) => {
    try {
        const response = await axios.get(`${HOST}/courses/courses-additional/${curriculumid}`,
            { withCredentials: true })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_COURSE_FINDALL_ACTIVE_IN_CURRICULUM = async () => {
    try {
        const response = await axios.get(`${HOST}/courses/courses-active-curriculum`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_COURSE_FINDONE = async ({ courseno }: IAPICourse) => {
    try {
        const response = await axios.get(`${HOST}/courses/${courseno}`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_COURSE_CREATE = async ({ code, courseno, descriptiveTitle, units }: IAPICourse) => {
    try {
        const response = await axios.post(`${HOST}/courses/create`, {
            code, courseno, descriptiveTitle, units
        }, { withCredentials: true })

        return response.data
    } catch (error) {
        console.error(error)
    }
}