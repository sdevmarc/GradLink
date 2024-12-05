export interface IAPIForms {
    _id: string
    email?: string
    generalInformation: {
        title: string
        description: string
        questions: FormGoogle[]
    }
    employmentData: {
        title: string
        description: string
        questions: FormGoogle[]
    }
    isApproved: boolean
    isActive: boolean
}


interface FormGoogle {
    question: string
    answer: string
}