export interface IUsers {
    id?: string
    email?: string
    password?: string
    role?: string
    isactive?: boolean
    name?: string
    otp?: number
}

export interface IPromiseUser {
    success: boolean
    message: string
    role?: string
    data?: IUsers[] | {} | ''
    access_token?: {}
}