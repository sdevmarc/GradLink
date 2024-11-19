import { HOST } from '@/constants'
import { IAPIOffered } from '@/interface/offered.interface'
import axios from 'axios'

axios.defaults.withCredentials = true;

export const API_FINDALL_COURSES_OFFERED = async () => {
    try {
        const response = await axios.get(`${HOST}/offered`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_FINDALL_COURSES_OFFERED_IN_ACADEMIC_YEAR = async ({ academicYear }: { academicYear: string }) => {
    try {
        const response = await axios.get(`${HOST}/offered/academic-year/${academicYear}`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_FINDALL_ACADEMIC_YEARS_IN_OFFERED_COURSES = async () => {
    try {
        const response = await axios.get(`${HOST}/offered/academic-years`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

// export const API_FINDALL_COURSES_OFFERED_LEGACY = async ({ pageParam = 1 }: { pageParam: number }): Promise<IOffered> => {
//     try {
//         const response = await axios.get(`${HOST}/offered/legacy`, {
//             params: {
//                 page: pageParam,
//                 limit: 5,  // Set the limit to whatever suits your needs
//             },
//         });
//         return {
//             docs: response.data.data.docs,  // Accessing nested 'data' field in the response
//             pagination: response.data.data.pagination,
//         };
//     } catch (error) {
//         console.error(error);
//         throw error;  // Rethrow error to handle it in calling code if needed
//     }
// };

export const API_CREATE_COURSES_OFFERED = async ({ courses, semester, academicYear }: IAPIOffered) => {
    try {
        const response = await axios.post(`${HOST}/offered/create`, {
            courses, semester, academicYear
        }, { withCredentials: true })

        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const API_UPDATE_COURSES_OFFERED = async ({ courses }: IAPIOffered) => {
    try {
        const response = await axios.post(`${HOST}/offered/update`, {
            courses
        }, { withCredentials: true })

        return response.data
    } catch (error) {
        console.error(error)
    }
}