export interface IAPISettings {
    isenroll?: boolean
}

export interface IAPIAuditlog {
    _id?: string;
    action?: string;
    description?: string;
    updatedAt?: string;
    name?: string;
    id?: string
    user?: string
    details?: string
    timestamp?: string
}