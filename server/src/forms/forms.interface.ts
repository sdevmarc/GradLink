export interface IFormValues {
    type?: string;
    questionTitle: string;
    options?: string[];
    required?: boolean;
}

export interface IForms {
    title?: string;
    generalInformation?: IFormValues[];
    educationalBackground?: IFormValues[];
    trainingAdvanceStudies?: IFormValues[];
}

export interface IPromiseForms {
    success: boolean;
    message: string;
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