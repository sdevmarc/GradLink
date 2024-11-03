import { HOST } from '@/constants'
import { IAPICourse, IRequestUpdateCourse } from '@/interface/course.interface'
import axios from 'axios'

export const API_COURSE_FINDALL = async () => {
    try {
        const response = await axios.get(`${HOST}/courses`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_COURSE_FINDALL_COURSES_IN_NEW_STUDENT = async ({ curriculumid }: IAPICourse) => {
    try {
        const response = await axios.get(`${HOST}/courses/courses-additional/${curriculumid}`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_COURSE_FINDALL_ACTIVE_IN_CURRICULUM = async () => {
    try {
        const response = await axios.get(`${HOST}/courses/courses-active-curriculum`)
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

export const API_COURSE_CREATE = async ({ code, courseno, descriptiveTitle, units }: IAPICourse) => {
    try {
        const response = await axios.post(`${HOST}/courses/create`, {
            code, courseno, descriptiveTitle, units
        })

        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_COURSE_UPDATE_COURSES_OFFERED = async ({ id }: IRequestUpdateCourse) => {
    try {
        const response = await axios.post(`${HOST}/courses/update-courses-offered`, {
            id
        })

        return response.data
    } catch (error) {
        console.error(error)
    }
}