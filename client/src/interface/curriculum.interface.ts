import { IAPIPrograms } from "./program.interface";

export interface IRequestCurriculum {
    name: string
    programs: IAPIPrograms[]
}