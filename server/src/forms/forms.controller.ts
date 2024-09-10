import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';
import { FormsService } from './forms.service';
import { IForms } from './forms.interface';

@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService) { }

    @Get('form-struc')
    async GetStruc() {
        return this.formsService.getFormStructure('14yw3zUJGQEsnBGb99uDATykbutGCuJJsFLyUV4IgxEs')
    }

    @Get('form-mapped')
    async GetMappQuestions() {
        return this.formsService.mapQuestionsToAnswers('14yw3zUJGQEsnBGb99uDATykbutGCuJJsFLyUV4IgxEs')
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