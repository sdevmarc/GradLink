interface IPre_req {
    courseno: string
}

interface IDegree {
    code: string
}

export interface IAPICourse {
    cid?: string
    courseno?: string
    descriptiveTitle?: string
    degree?: IDegree[]
    units?: string | ''
    pre_req?: IPre_req[]
}