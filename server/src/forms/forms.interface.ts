export interface IFormValues {
    type?: string
    questionTitle: string;
    options: string[]
}

export interface IForms {
    title?: string
    description?: string
    items?: IFormValues[]
}

export interface IPromiseForms {
    success: boolean
    message: string
}

export interface FormResponse {
    responseId: string;
    answers: {
        [questionId: string]: {
            questionTitle: string;
            textAnswers?: { answers: { value: string }[] };
            fileUploadAnswers?: { answers: { fileId: string }[] };
            // Add other answer types as needed
        };
    };
}