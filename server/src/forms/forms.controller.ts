import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormStructure, IForms } from './forms.interface';
import { ConstantsService } from 'src/constants/constants.service';

@Controller('forms')
export class FormsController {
    constructor(
        private readonly formsService: FormsService,
        private readonly constantsService: ConstantsService
    ) { }

    @Get('form-struc')
    async GetStruc()
        : Promise<FormStructure> {
        return this.formsService.getFormStructure(this.constantsService.getFormId())
    }

    @Get('form-mapped')
    async GetMappedQuestions() {
        return this.formsService.mapQuestionsToAnswers(this.constantsService.getFormId())
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
        return this.formsService.createFormWithQuestions({ title, generalInformation, educationalBackground, trainingAdvanceStudies });
    }

    @Post(':formId/add-short-answer-question')
    async addShortAnswerQuestion(
        @Param('formId') formId: string,
        @Body('questionTitle') questionTitle: string
    ): Promise<void> {
        return this.formsService.addShortAnswerQuestion(formId, questionTitle);
    }

    @Post(':formId/add-paragraph-question')
    async addParagraphQuestion(
        @Param('formId') formId: string,
        @Body('questionTitle') questionTitle: string
    ): Promise<void> {
        return this.formsService.addParagraphQuestion(formId, questionTitle);
    }

    @Post(':formId/add-multiple-choice-question')
    async addMultipleChoiceQuestion(
        @Param('formId') formId: string,
        @Body('questionTitle') questionTitle: string,
        @Body('options') options: string[]
    ): Promise<void> {
        return this.formsService.addMultipleChoiceQuestion(formId, questionTitle, options);
    }

    @Post(':formId/add-checkbox-question')
    async addCheckboxQuestion(
        @Param('formId') formId: string,
        @Body('questionTitle') questionTitle: string,
        @Body('options') options: string[]
    ): Promise<void> {
        return this.formsService.addCheckboxQuestion(formId, questionTitle, options);
    }

    @Post(':formId/add-dropdown-question')
    async addDropdownQuestion(
        @Param('formId') formId: string,
        @Body('questionTitle') questionTitle: string,
        @Body('options') options: string[]
    ): Promise<void> {
        return this.formsService.addDropdownQuestion(formId, questionTitle, options);
    }
}
