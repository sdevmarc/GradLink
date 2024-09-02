import { Injectable } from '@nestjs/common';
import { google, forms_v1 } from 'googleapis';
import { ConfigService } from '@nestjs/config';

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

    async createForm(title: string, description: string): Promise<string> {
        try {
            const res = await this.forms.forms.create({
                requestBody: {
                    info: {
                        title: title,
                        description: description,
                    },
                },
            });

            return res.data.formId;
        } catch (error) {
            console.error('Error creating form:', error)
            throw error;
        }
    }

    async getAllResponses(formId: string): Promise<any> {
        try {
            const res = await this.forms.forms.responses.list({
                formId,
            });
    
            return res.data.responses; // Contains the list of all responses
        } catch (error) {
            console.error('Error retrieving responses:', error);
            throw error;
        }
    }

    async addShortAnswerQuestion(formId: string, questionTitle: string): Promise<void> {
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

    async addParagraphQuestion(formId: string, questionTitle: string): Promise<void> {
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


    async addMultipleChoiceQuestion(formId: string, questionTitle: string, options: string[]): Promise<void> {
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

    async addCheckboxQuestion(formId: string, questionTitle: string, options: string[]): Promise<void> {
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
