import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';
import { FormsService } from './forms.service';
import { IForms } from './forms.interface';

@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService) { }

    @Get(':formId/responses')
    async getResponses(@Param('formId') formId: string) {
        try {
            const responses = await this.formsService.getAllResponses(formId);
            if (!responses) {
                throw new NotFoundException(`No responses found for form ID ${formId}`);
            }
            return responses;
        } catch (error) {
            console.error('Error retrieving responses:', error);
            throw new InternalServerErrorException('Failed to retrieve form responses');
        }
    }

    @Post('create-form')
    async createForm(
        @Body() { title, description, items }: IForms
    ) {
        return this.formsService.createFormWithQuestions({ title, description, items });
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
