import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormStructure, IEvaluationForm, IForms, IModelForm } from './forms.interface';
import { ConstantsService } from 'src/constants/constants.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStudent } from 'src/student/student.interface';
import { StudentService } from 'src/student/student.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('forms')
@UseGuards(AuthGuard)
export class FormsController {
    constructor(
        private readonly formsService: FormsService,
        private readonly studentService: StudentService,
        @InjectModel('Student') private readonly studentModel: Model<IStudent>,
        @InjectModel('Form') private readonly formModel: Model<IEvaluationForm>,
        private readonly constantsService: ConstantsService
    ) { }

    @Get()
    async getTracerRespondents() {
        return await this.formsService.getAllTracers()
    }

    @Get('rejects')
    async getRejectRespondents() {
        return await this.formsService.findRejects()
    }

    @Get('google-link')
    async getGoogleFormLink() {
        return await this.formsService.getGoogleFormLink()
    }

    @Get('unknown-respondents')
    async getUnknownRespondents() {
        return await this.formsService.getUnknownRespondents()
    }

    @Get('form-struc')
    async GetStruc()
        : Promise<FormStructure> {
        return await this.formsService.getFormStructure(this.constantsService.getFormId())
    }

    @Get('form-mapped')
    async GetMappedQuestions() {
        try {
            const response = await this.formsService.mapQuestionsToAnswers(this.constantsService.getFormId())

            const updatePromises = response.map(async (item) => {
                const lastname = String(item.generalInformation.answers[0].answer);
                const firstname = String(item.generalInformation.answers[1].answer);
                const middlename = String(item.generalInformation.answers[2].answer);

                const formemail = String(item.generalInformation.answers[8].answer);
                const currentaddress = String(item.generalInformation.answers[7].answer);
                const coordinates = await this.formsService.getCoordinates(currentaddress);

                const {
                    // createTime,
                    generalInformation,
                    //  educationalBackground,
                    employmentData
                } = item;

                const isEmailInStudent = await this.studentModel.findOne({ email: formemail })
                if (isEmailInStudent) {
                    return await this.studentService.formUpdateStudent({
                        email: formemail,
                        generalInformation,
                        //  educationalBackground, 
                        coordinates,
                        employmentData,
                        lastname,
                        firstname,
                        middlename
                    })
                }

                const isemail = await this.formModel.findOne({ email: formemail })

                if (isemail) return { email: formemail, message: `Email ${formemail} already exists in form model.` }

                const filteredgeneral = generalInformation.answers.map(item => {
                    const { question, answer } = item
                    return { question, answer }
                })

                const filteredemployment = employmentData.answers.map(item => {
                    const { question, answer } = item
                    return { question, answer }
                })

                const finalGeneral = {
                    title: generalInformation?.title,
                    description: generalInformation?.description,
                    questions: filteredgeneral
                }

                const finalEmploymentData = {
                    title: employmentData?.title,
                    description: employmentData?.description,
                    questions: filteredemployment
                }

                await this.formModel.create({ email: formemail, generalInformation: finalGeneral, employmentData: finalEmploymentData })
                return { email: formemail, status: 'Email does not exists in the Gradlink.' }

            })

            const updateResults = await Promise.all(updatePromises)
            return {
                success: true,
                message: 'Questions mapped successfully!',
                data: {
                    mappingResults: updateResults,
                    responseData: response
                }
            }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Questions failed to map.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get(':formId/responses')
    async getResponses(@Param('formId') formId: string) {
        try {
            return await this.formsService.getAllResponses(formId);
        } catch (error) {
            console.error('Error retrieving responses:', error);
            throw new InternalServerErrorException('Failed to retrieve form responses');
        }
    }

    @Post('create-form')
    async createForm(
        @Body() {
            title,
            generalInformation,
            //  educationalBackground,
            employmentData
        }: IForms
    ) {
        return await this.formsService.createFormWithQuestions({
            title,
            generalInformation,
            //    educationalBackground,
            employmentData
        });
    }

    @Post(':formId/add-short-answer-question')
    async addShortAnswerQuestion(
        @Param('formId') formId: string,
        @Body('questionTitle') questionTitle: string
    ): Promise<void> {
        return await this.formsService.addShortAnswerQuestion(formId, questionTitle);
    }

    @Post(':formId/add-paragraph-question')
    async addParagraphQuestion(
        @Param('formId') formId: string,
        @Body('questionTitle') questionTitle: string
    ): Promise<void> {
        return await this.formsService.addParagraphQuestion(formId, questionTitle);
    }

    @Post(':formId/add-multiple-choice-question')
    async addMultipleChoiceQuestion(
        @Param('formId') formId: string,
        @Body('questionTitle') questionTitle: string,
        @Body('options') options: string[]
    ): Promise<void> {
        return await this.formsService.addMultipleChoiceQuestion(formId, questionTitle, options);
    }

    @Post(':formId/add-checkbox-question')
    async addCheckboxQuestion(
        @Param('formId') formId: string,
        @Body('questionTitle') questionTitle: string,
        @Body('options') options: string[]
    ): Promise<void> {
        return await this.formsService.addCheckboxQuestion(formId, questionTitle, options);
    }

    @Post(':formId/add-dropdown-question')
    async addDropdownQuestion(
        @Param('formId') formId: string,
        @Body('questionTitle') questionTitle: string,
        @Body('options') options: string[]
    ): Promise<void> {
        return await this.formsService.addDropdownQuestion(formId, questionTitle, options);
    }

    @Post('evaluate-form-tracer')
    async EvaluateFormTracer(
        @Body() { id, isApproved }: { id: string, isApproved?: boolean }
    ) {
        return await this.formsService.evaluateIncomingTracer({ id, isApproved })
    }

    @Post('restore-reject')
    async RestoreReject(
        @Body() { id }: { id: string}
    ) {
        return await this.formsService.restoreRejectRespondent({ id })
    }
}
