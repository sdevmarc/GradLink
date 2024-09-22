export interface IMail {
    send_to?: string
    idNumber?: string
    date_sent?: string
    notes?: string
}

export interface IPromiseMail {
    success?: boolean
    message?: string
    data?: string
}
