import { Injectable } from '@nestjs/common';
import { google, forms_v1 } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { FormStructure, IForms, IFormValues, IPromiseForms, MappedResponse, MappedSection } from './forms.interface';



@Injectable()
export class FormsService {
    private forms: forms_v1.Forms

    constructor(
        private configService: ConfigService
    ) {
        const auth = new google.auth.GoogleAuth({
            keyFile: this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS'),
            scopes: [
                'https://www.googleapis.com/auth/forms.body',
                'https://www.googleapis.com/auth/forms.responses.readonly'
            ],
        })

        this.forms = google.forms({ version: 'v1', auth })
    }

    async getFormStructure(formId: string): Promise<FormStructure> {
        try {
            const res = await this.forms.forms.get({
                formId,
            });

            const formItems = res.data.items || [];

            let currentSection: keyof FormStructure = 'generalInformation';

            const structure: FormStructure = {
                generalInformation: { questions: [] },
                educationalBackground: { questions: [] },
                trainingAdvanceStudies: { questions: [] }
            };

            formItems.forEach((item) => {
                if (item.pageBreakItem) {
                    switch (item.title) {
                        case 'EDUCATIONAL BACKGROUND':
                            currentSection = 'educationalBackground';
                            structure[currentSection].description = item.description || '';
                            break;
                        case 'TRAINING(S) ADVANCE STUDIES ATTENDED AFTER COLLEGE':
                            currentSection = 'trainingAdvanceStudies';
                            structure[currentSection].description = item.description || '';
                            break;
                    }
                } else if (item.questionItem || item.questionGroupItem) {
                    const questionId = item.questionItem?.question?.questionId || item.itemId;
                    const title = item.title || 'Untitled Question';
                    structure[currentSection].questions.push({ questionId, title });
                }
            });

            return structure;

        } catch (error) {
            console.error('Error retrieving form structure:', error);
            throw error;
        }
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

    async mapQuestionsToAnswers(formId: string): Promise<MappedResponse[]> {
        try {
            const formStructure = await this.getFormStructure(formId);
            const responses = await this.getAllResponses(formId);

            const mappedResponses: MappedResponse[] = responses.responses.map((response) => {
                let overallIndex = 1;
                const mappedResponse: MappedResponse = {
                    responseId: response.responseId,
                    createTime: response.createTime,
                    generalInformation: { title: 'GENERAL INFORMATION', answers: [] },
                    educationalBackground: { title: 'EDUCATIONAL BACKGROUND', answers: [] },
                    trainingAdvanceStudies: { title: 'TRAINING(S) ADVANCE STUDIES ATTENDED AFTER COLLEGE', answers: [] },
                };

                for (const [sectionKey, section] of Object.entries(formStructure)) {
                    const mappedSection = mappedResponse[sectionKey as keyof MappedResponse] as MappedSection;
                    mappedSection.description = section.description;

                    for (const question of section.questions) {
                        const answer = response.answers[question.questionId];
                        mappedSection.answers.push({
                            index: overallIndex++,
                            question: question.title,
                            answer: answer?.textAnswers?.answers[0]?.value || 'No answer provided',
                        });
                    }
                }

                return mappedResponse;
            });

            return mappedResponses;
        } catch (error) {
            console.error('Error mapping questions to answers:', error);
            throw error;
        }
    }

    async createFormWithQuestions({ title, generalInformation, educationalBackground, trainingAdvanceStudies }: IForms)
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

            // Step 2: Update the form to add description, sections, and questions
            const requests: forms_v1.Schema$Request[] = [
                // Add description
                {
                    updateFormInfo: {
                        info: {
                            description: `Dear Graduate,

Please complete this Graduate Tracer Survey (GTS) honestly by selecting the appropriate options. Your responses will help assess graduate employability and improve courses at universities in the Philippines. All answers will be kept confidential.

Thank you for your time!`,
                        },
                        updateMask: 'description',
                    },
                },
            ];

            let currentIndex = 0;

            // Add general information section and questions
            if (generalInformation && generalInformation.length > 0) {
                requests.push({
                    createItem: {
                        item: {
                            title: 'GENERAL INFORMATION',
                            description: `Please provide your basic information to help us better understand the demographic profile of our respondents. This will ensure that the data collected is categorized accurately.`,
                            pageBreakItem: {}
                        },
                        location: {
                            index: currentIndex++
                        }
                    }
                });
                requests.push(...this.createQuestionRequests(generalInformation, currentIndex));
                currentIndex += generalInformation.length;
            }

            // Add educational background section and questions
            if (educationalBackground && educationalBackground.length > 0) {
                requests.push({
                    createItem: {
                        item: {
                            title: 'EDUCATIONAL BACKGROUND',
                            description: `Kindly share details about your educational background, including your degree and institution. This will help us assess the relevance of your academic qualifications to your current employment.`,
                            pageBreakItem: {}
                        },
                        location: {
                            index: currentIndex++
                        }
                    }
                });
                requests.push(...this.createQuestionRequests(educationalBackground, currentIndex));
                currentIndex += educationalBackground.length;
            }

            // Add training and advance studies section and questions
            if (trainingAdvanceStudies && trainingAdvanceStudies.length > 0) {
                requests.push({
                    createItem: {
                        item: {
                            title: 'TRAINING(S) ADVANCE STUDIES ATTENDED AFTER COLLEGE',
                            description: `If applicable, please list any further studies, training, or certifications you have completed after your undergraduate degree. This will help us evaluate the role of additional qualifications in enhancing employability.`,
                            pageBreakItem: {}
                        },
                        location: {
                            index: currentIndex++
                        }
                    }
                });
                requests.push(...this.createQuestionRequests(trainingAdvanceStudies, currentIndex));
                currentIndex += trainingAdvanceStudies.length;
            }

            await this.forms.forms.batchUpdate({
                formId,
                requestBody: {
                    requests: requests,
                },
            });

            return { success: true, message: 'Form created successfully', data: res.data };
        } catch (error) {
            console.error('Error creating form:', error);
            throw error;
        }
    }

    private createQuestionRequests(items: IFormValues[], startIndex: number): forms_v1.Schema$Request[] {
        return items.map((item, index) => {
            const createItemRequest: forms_v1.Schema$Request = {
                createItem: {
                    item: {
                        title: item.questionTitle,
                        questionItem: {
                            question: {
                                required: item.required  // Use the required field from IFormValues
                            }
                        },
                        questionGroupItem: null
                    },
                    location: {
                        index: startIndex + index,
                    },
                },
            };

            switch (item.type) {
                case 'shortanswer':
                    createItemRequest.createItem.item.questionItem.question = {
                        textQuestion: {},
                        required: item.required
                    };
                    break;
                case 'paragraph':
                    createItemRequest.createItem.item.questionItem.question = {
                        textQuestion: {
                            paragraph: true,
                        },
                        required: item.required
                    };
                    break;
                case 'multiplechoice':
                    createItemRequest.createItem.item.questionItem.question = {
                        choiceQuestion: {
                            type: 'RADIO',
                            options: [
                                ...(item.options || []).map(option => ({ value: option })),
                                { isOther: true }
                            ]
                        },
                        required: item.required
                    };
                    break;
                case 'checkbox':
                    createItemRequest.createItem.item.questionItem.question = {
                        choiceQuestion: {
                            type: 'CHECKBOX',
                            options: [
                                ...(item.options || []).map(option => ({ value: option })),
                                { isOther: true }
                            ]
                        },
                        required: item.required
                    };
                    break;
                case 'dropdown':
                    createItemRequest.createItem.item.questionItem.question = {
                        choiceQuestion: {
                            type: 'DROP_DOWN',
                            options: (item.options || []).map(option => ({ value: option })),
                        },
                        required: item.required
                    };
                    break;
                case 'date':
                    createItemRequest.createItem.item.questionItem.question = {
                        dateQuestion: {
                            includeTime: false,
                            includeYear: true
                        },
                        required: item.required
                    };
                    break;
                case 'grid':
                    if (!item.grid) {
                        throw new Error('Grid question must have row and column labels');
                    }
                    const gridRequest: forms_v1.Schema$Request = {
                        createItem: {
                            item: {
                                title: item.questionTitle,
                                questionGroupItem: {
                                    grid: {
                                        columns: {
                                            type: 'RADIO',
                                            options: (item.grid.columnLabels || []).map(column => ({ value: column })),
                                        },
                                        shuffleQuestions: false,
                                    },
                                    questions: (item.grid.rowLabels || []).map(row => ({
                                        rowQuestion: {
                                            title: row,
                                        },
                                    })),
                                },
                            },
                            location: {
                                index: startIndex + index,
                            },
                        },
                    };
                    return gridRequest;

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
