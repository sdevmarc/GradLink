export interface IMail {
    idNumber?: string
    date_sent?: string
    notes?: string
}

export interface IPromiseMail {
    success?: boolean
    message?: string
    data?: string
}
