import { ICurriculum } from "./curriculum.interface"

export interface IAPIPrograms {
    _id?: string
    code?: string
    descriptiveTitle?: string
    residency?: string
    department?: string

    totalUnits?: number
    curriculum?: ICurriculum
}