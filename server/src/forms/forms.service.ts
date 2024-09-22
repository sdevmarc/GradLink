import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { google, forms_v1 } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { FormStructure, GridQuestion, IForms, IFormValues, IModelForm, IPromiseForms, MappedResponse, MappedSection, Question } from './forms.interface';
import { StudentService } from 'src/student/student.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';



@Injectable()
export class FormsService {
    private forms: forms_v1.Forms

    constructor(
        private configService: ConfigService,
        @InjectModel('Form') private readonly formModel: Model<IModelForm>
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

    async getUnknownRespondents(): Promise<IPromiseForms> {
        try {
            // const formatDate = (date: string | Date) => {
            //     const d = new Date(date);
            //     const month = (d.getMonth() + 1).toString().padStart(2, '0');
            //     const day = d.getDate().toString().padStart(2, '0');
            //     const year = d.getFullYear();
            //     let hours = d.getHours();
            //     const minutes = d.getMinutes().toString().padStart(2, '0');
            //     const ampm = hours >= 12 ? 'PM' : 'AM';
            //     hours = hours % 12;
            //     hours = hours ? hours : 12; // the hour '0' should be '12'
            //     const formattedHours = hours.toString().padStart(2, '0');

            //     return `${month}/${day}/${year} - ${formattedHours}:${minutes} ${ampm}`;
            // };

            const response = await this.formModel.aggregate([
                {
                    $match: { status: true }
                },

                {
                    $addFields: {
                        date_sent_date: {
                            $dateToString: {
                                date: '$date_sent',
                                format: '%m/%d/%Y'
                            }
                        }
                    }
                },
                {
                    $sort: { 'date_sent_date': -1 }
                },

                {
                    $project: {
                        _id: 1,
                        idNumber: 1,
                        notes: 1,
                        status: 1,
                        date_sent: '$date_sent_date'
                    }
                }
            ])

            return { success: true, message: 'Unknown respondents fetched successfully!', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to fetch unknown respondents.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
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
                } else if (item.questionItem) {
                    const questionData = item.questionItem.question;
                    const question: Question = {
                        questionId: questionData?.questionId || item.itemId,
                        title: item.title || 'Untitled Question',
                        type: this.getQuestionType(questionData),
                        options: this.getQuestionOptions(questionData)
                    };
                    structure[currentSection].questions.push(question);
                } else if (item.questionGroupItem) {
                    const gridQuestion: GridQuestion = {
                        questionId: item.itemId,
                        title: item.title || 'Untitled Grid Question',
                        type: 'GRID',
                        options: item.questionGroupItem.grid?.columns?.options?.map(o => o.value) || [],
                        rowQuestions: item.questionGroupItem.questions.map(q => ({
                            questionId: q.questionId,
                            title: q.rowQuestion?.title || 'Untitled Row',
                            type: item.questionGroupItem.grid?.columns?.type || 'RADIO',
                            options: item.questionGroupItem.grid?.columns?.options?.map(o => o.value) || []
                        }))
                    };
                    structure[currentSection].questions.push(gridQuestion);
                }
            });

            return structure;

        } catch (error) {
            console.error('Error retrieving form structure:', error);
            throw error;
        }
    }

    private getQuestionType(question: forms_v1.Schema$Question | undefined): string {
        if (!question) return 'UNKNOWN';
        if (question.textQuestion) return 'TEXT';
        if (question.choiceQuestion) return 'CHOICE';
        if (question.dateQuestion) return 'DATE';
        if (question.timeQuestion) return 'TIME';
        if (question.scaleQuestion) return 'SCALE';
        if (question.fileUploadQuestion) return 'FILE_UPLOAD';
        return 'UNKNOWN';
    }

    private getQuestionOptions(question: forms_v1.Schema$Question | undefined): string[] | undefined {
        if (!question || !question.choiceQuestion) return undefined;
        return question.choiceQuestion.options?.map(o => o.value || '') || [];
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

            // Create a map to store the latest response for each idNumber
            const latestResponseMap = new Map<string, MappedResponse>();

            responses.responses.forEach((response) => {
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
                        let mappedAnswer: string | { [row: string]: string };

                        if (question.type === 'GRID') {
                            mappedAnswer = {};
                            (question as GridQuestion).rowQuestions.forEach((rowQuestion) => {
                                const rowAnswer = response.answers[rowQuestion.questionId];
                                mappedAnswer[rowQuestion.title] = rowAnswer?.textAnswers?.answers[0]?.value || 'No answer provided';
                            });
                        } else {
                            mappedAnswer = this.getAnswerValue(answer, question.type);
                        }

                        mappedSection.answers.push({
                            index: overallIndex++,
                            question: question.title,
                            answer: mappedAnswer,
                            type: question.type,
                        });
                    }
                }

                // Get the idNumber from the mapped response
                const idNumber = mappedResponse.generalInformation.answers[0].answer as string;

                // Check if we already have a response for this idNumber
                if (!latestResponseMap.has(idNumber) ||
                    new Date(mappedResponse.createTime) > new Date(latestResponseMap.get(idNumber)!.createTime)) {
                    latestResponseMap.set(idNumber, mappedResponse);
                }
            });

            // Convert the map values back to an array
            const mappedResponses = Array.from(latestResponseMap.values());

            return mappedResponses;
        } catch (error) {
            console.error('Error mapping questions to answers:', error);
            throw error;
        }
    }

    private getAnswerValue(answer: forms_v1.Schema$Answer | undefined, questionType: string): string {
        if (!answer) return 'No answer provided';

        switch (questionType) {
            case 'TEXT':
            case 'PARAGRAPH':
                return answer.textAnswers?.answers[0]?.value || 'No answer provided';
            case 'CHOICE':
                return answer.textAnswers?.answers.map(a => a.value).join(', ') || 'No answer provided';
            case 'DATE':
                const dateAnswer = answer.textAnswers?.answers[0]?.value;
                return dateAnswer ? new Date(dateAnswer).toLocaleDateString() : 'No answer provided';
            case 'TIME':
                return answer.textAnswers?.answers[0]?.value || 'No answer provided';
            case 'SCALE':
                return answer.textAnswers?.answers[0]?.value || 'No answer provided';
            case 'FILE_UPLOAD':
                return answer.fileUploadAnswers?.answers.map(a => a.fileId).join(', ') || 'No files uploaded';
            default:
                return 'Unsupported question type';
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
