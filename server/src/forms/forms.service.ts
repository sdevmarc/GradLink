import { Injectable } from '@nestjs/common';
import { google, forms_v1 } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { IForms, IFormValues, IPromiseForms } from './forms.interface';

@Injectable()
export class FormsService {
    private forms: forms_v1.Forms

    constructor(private configService: ConfigService) {
        const auth = new google.auth.GoogleAuth({
            keyFile: this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS'),
            scopes: [
                'https://www.googleapis.com/auth/forms.body',
                'https://www.googleapis.com/auth/forms.responses.readonly'
            ],
        })

        this.forms = google.forms({ version: 'v1', auth })
    }

    async getAllResponses(formId: string): Promise<any> {
        try {
            const res = await this.forms.forms.responses.list({
                formId,
            });

            return res.data; // Contains the list of all responses
        } catch (error) {
            console.error('Error retrieving responses:', error);
            throw error;
        }
    }

    async createFormWithQuestions({ title, description, items }: IForms)
        : Promise<{ success: boolean, message: string, data: {} }> {
        try {
            // Step 1: Create the form with only the title
            const res = await this.forms.forms.create({
                requestBody: {
                    info: {
                        title: title,
                    },
                },
            });
            const formId = res.data.formId;

            // Step 2: Update the form to add description and questions
            const requests: forms_v1.Schema$Request[] = [
                // Add description
                {
                    updateFormInfo: {
                        info: {
                            description: description,
                        },
                        updateMask: 'description',
                    },
                },
                // Add questions
                ...this.createQuestionRequests(items),
            ];

            await this.forms.forms.batchUpdate({
                formId,
                requestBody: {
                    requests: requests,
                },
            });

            return {success: true, message: 'Form created successfully', data: res.data};
        } catch (error) {
            console.error('Error creating form:', error);
            throw error;
        }
    }

    private createQuestionRequests(items: IFormValues[]): forms_v1.Schema$Request[] {
        return items.map((item, index) => {
            const createItemRequest: forms_v1.Schema$Request = {
                createItem: {
                    item: {
                        title: item.questionTitle,
                        questionItem: {
                            question: {},
                        },
                    },
                    location: {
                        index: index,
                    },
                },
            };

            switch (item.type) {
                case 'shortanswer':
                    createItemRequest.createItem.item.questionItem.question = {
                        textQuestion: {},
                    };
                    break;
                case 'paragraph':
                    createItemRequest.createItem.item.questionItem.question = {
                        textQuestion: {
                            paragraph: true,
                        },
                    };
                    break;
                case 'multiplechoice':
                    createItemRequest.createItem.item.questionItem.question = {
                        choiceQuestion: {
                            type: 'RADIO',
                            options: (item.options || []).map(option => ({ value: option })),
                        },
                    };
                    break;
                case 'checkbox':
                    createItemRequest.createItem.item.questionItem.question = {
                        choiceQuestion: {
                            type: 'CHECKBOX',
                            options: (item.options || []).map(option => ({ value: option })),
                        },
                    };
                    break;
                case 'dropdown':
                    createItemRequest.createItem.item.questionItem.question = {
                        choiceQuestion: {
                            type: 'DROP_DOWN',
                            options: (item.options || []).map(option => ({ value: option })),
                        },
                    };
                    break;
                case 'date':
                    createItemRequest.createItem.item.questionItem.question = {
                        dateQuestion: {},
                    };
                    break;
                default:
                    throw new Error(`Unsupported question type: ${item.type}`);
            }

            return createItemRequest;
        });
    }

    async addShortAnswerQuestion(formId: string, questionTitle: string)
        : Promise<void> {
        try {
            await this.forms.forms.batchUpdate({
                formId,
                requestBody: {
                    requests: [
                        {
                            createItem: {
                                item: {
                                    title: questionTitle,
                                    questionItem: {
                                        question: {
                                            textQuestion: {},
                                        },
                                    },
                                },
                                location: {
                                    index: 0,
                                },
                            },
                        },
                    ],
                },
            });
        } catch (error) {
            console.error('Error adding question:', error);
            throw error;
        }
    }

    async addParagraphQuestion(formId: string, questionTitle: string)
        : Promise<void> {
        try {
            await this.forms.forms.batchUpdate({
                formId,
                requestBody: {
                    requests: [
                        {
                            createItem: {
                                item: {
                                    title: questionTitle,
                                    questionItem: {
                                        question: {
                                            textQuestion: {
                                                paragraph: true
                                            }
                                        },
                                    },
                                },
                                location: {
                                    index: 0,
                                },
                            },
                        },
                    ],
                },
            });
        } catch (error) {
            console.error('Error adding question:', error);
            throw error;
        }
    }


    async addMultipleChoiceQuestion(formId: string, questionTitle: string, options: string[])
        : Promise<void> {
        try {
            await this.forms.forms.batchUpdate({
                formId,
                requestBody: {
                    requests: [
                        {
                            createItem: {
                                item: {
                                    title: questionTitle,
                                    questionItem: {
                                        question: {
                                            required: true,
                                            choiceQuestion: {
                                                type: "RADIO",
                                                options: options.map(option => ({ value: option })),
                                            },
                                        },
                                    },
                                },
                                location: {
                                    index: 0,
                                },
                            },
                        },
                    ],
                },
            });
        } catch (error) {
            console.error('Error adding question:', error);
            throw error;
        }
    }

    async addCheckboxQuestion(formId: string, questionTitle: string, options: string[])
        : Promise<void> {
        try {
            await this.forms.forms.batchUpdate({
                formId,
                requestBody: {
                    requests: [
                        {
                            createItem: {
                                item: {
                                    title: questionTitle,
                                    questionItem: {
                                        question: {
                                            choiceQuestion: {
                                                type: 'CHECKBOX',
                                                options: options.map(option => ({ value: option })),
                                            },
                                        },
                                    },
                                },
                                location: {
                                    index: 0,
                                },
                            },
                        },
                    ],
                },
            });

            // await this.forms.forms.batchUpdate({
            //     formId,
            //     requestBody: {
            //         requests: [
            //             {
            //                 createItem: {
            //                     item: {
            //                         title: questionTitle,
            //                         questionItem: {
            //                             question: {
            //                                 type: 'CHECK_BOX',
            //                                 checkboxQuestion: {
            //                                     options: options.map(option => ({ value: option })),
            //                                 },
            //                             },
            //                         },
            //                     },
            //                     location: {
            //                         index: 0,
            //                     },
            //                 },
            //             },
            //         ],
            //     },
            // });
        } catch (error) {
            console.error('Error adding question:', error);
            throw error;
        }
    }


    async addDropdownQuestion(formId: string, questionTitle: string, options: string[]): Promise<void> {
        try {
            await this.forms.forms.batchUpdate({
                formId,
                requestBody: {
                    requests: [
                        {
                            createItem: {
                                item: {
                                    title: questionTitle,
                                    questionItem: {
                                        question: {
                                            choiceQuestion: {
                                                type: 'DROP_DOWN',
                                                options: options.map(option => ({ value: option })),
                                            },
                                        },
                                    },
                                },
                                location: {
                                    index: 0,
                                },
                            },
                        },
                    ],
                },
            });
        } catch (error) {
            console.error('Error adding question:', error);
            throw error;
        }
    }

}
