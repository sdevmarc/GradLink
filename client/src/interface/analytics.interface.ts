
export interface IData {
    _id: string
    count: string
}

export interface IExtendAnalytics {
    title: string
    data: IData[]
}

interface IAnalytics {
    timeToLandJob: IExtendAnalytics
    courseRelatedJob: IExtendAnalytics
}

export interface ITracerAnalytics {
    department?: string
    program?: string
    academicYear?: string
    analytics?: IAnalytics
}