import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormStructure, IForms, IModelForm } from './forms.interface';
import { ConstantsService } from 'src/constants/constants.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStudent } from 'src/student/student.interface';
import { StudentService } from 'src/student/student.service';

@Controller('forms')
export class FormsController {
    constructor(
        private readonly formsService: FormsService,
        private readonly studentService: StudentService,
        @InjectModel('Student') private readonly studentModel: Model<IStudent>,
        @InjectModel('Form') private readonly formModel: Model<IModelForm>,
        private readonly constantsService: ConstantsService
    ) { }

    @Get('form-struc')
    async GetStruc()
        : Promise<FormStructure> {
        return await this.formsService.getFormStructure(this.constantsService.getFormId())
    }

    @Get('form-mapped')
    async GetMappedQuestions() {
        try {
            const response = await this.formsService.mapQuestionsToAnswers(this.constantsService.getFormId())

            const formatDate = (date: string | Date) => {
                const d = new Date(date);
                const month = (d.getMonth() + 1).toString().padStart(2, '0');
                const day = d.getDate().toString().padStart(2, '0');
                const year = d.getFullYear();
                let hours = d.getHours();
                const minutes = d.getMinutes().toString().padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                const formattedHours = hours.toString().padStart(2, '0');

                return `${month}/${day}/${year} - ${formattedHours}:${minutes} ${ampm}`;
            };

            const updatePromises = response.map(async (item) => {
                const idNumber = String(item.generalInformation.answers[0].answer);
                const { createTime, generalInformation, educationalBackground, trainingAdvanceStudies } = item;

                const formattedCreateTime = formatDate(createTime);

                const is_idnumber_in_student = await this.studentModel.findOne({ idNumber })
                if (is_idnumber_in_student) return await this.studentService.formUpdateStudent({ idNumber, generalInformation, educationalBackground, trainingAdvanceStudies, })

                const is_idnumber_in_form = await this.formModel.findOne({ idNumber })

                if (is_idnumber_in_form) return { idNumber, message: 'ID Number exists in form model.' }
                const notes = 'Unknown respondent.'
                await this.formModel.create({ idNumber, date_sent: formattedCreateTime, notes })
                return { idNumber, status: 'Created' }

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
        @Body() { title, generalInformation, educationalBackground, trainingAdvanceStudies }: IForms
    ) {
        return await this.formsService.createFormWithQuestions({ title, generalInformation, educationalBackground, trainingAdvanceStudies });
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
}
