export interface IEvaluationForm {
    email: string
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

export interface IModelForm {
    idNumber?: string
    notes?: string
    status?: boolean
    date_sent?: string
}

export interface IFormValues {
    type?: string;
    questionTitle: string;
    options?: string[];
    required?: boolean;
    grid?: {
        columnLabels: string[];
        rowLabels: string[];
    };
}

export interface IForms {
    title?: string;
    generalInformation?: IFormValues[];
    // educationalBackground?: IFormValues[];
    employmentData?: IFormValues[];
}

export interface IPromiseForms {
    success: boolean
    message: string
    data?: IModelForm[] | {}
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

export interface Question {
    questionId: string;
    title: string;
    type: string;
    options?: string[];
}

export interface GridQuestion extends Question {
    rowQuestions: Question[];
}


interface FormSection {
    description?: string;
    questions: (Question | GridQuestion)[];
}

export interface FormStructure {
    generalInformation: FormSection;
    // educationalBackground: FormSection;
    employmentData: FormSection;
}

interface MappedAnswer {
    index: number;
    question: string;
    answer: string | { [row: string]: string };
    type: string;
}

export interface MappedSection {
    title: string;
    description?: string;
    answers: MappedAnswer[];
}

export interface MappedResponse {
    responseId: string;
    createTime: string;
    generalInformation: MappedSection;
    // educationalBackground?: MappedSection;
    employmentData: MappedSection;
}