import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormStructure, IForms, IModelForm } from './forms.interface';
import { ConstantsService } from 'src/constants/constants.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStudent } from 'src/student/student.interface';
import { StudentService } from 'src/student/student.service';

interface MapboxResponse {
    features: Array<{
        geometry: {
            coordinates: [number, number]; // [longitude, latitude]
        };
    }>;
}

interface GeocodedLocation {
    latitude: number;
    longitude: number;
}

@Controller('forms')
export class FormsController {
    constructor(
        private readonly formsService: FormsService,
        private readonly studentService: StudentService,
        @InjectModel('Student') private readonly studentModel: Model<IStudent>,
        @InjectModel('Form') private readonly formModel: Model<IModelForm>,
        private readonly constantsService: ConstantsService
    ) { }

    private readonly MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoieW91cnBhcmVuZ2VkaXNvbiIsImEiOiJjbTMyem81MHoxOTZzMmxzNDNwNXB4YmM4In0.YjqdD5S9U-Cw9kASDpJGVA';

    private async getCoordinates(address: string): Promise<GeocodedLocation | null> {
        try {
            const encodedAddress = encodeURIComponent(address);
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${this.MAPBOX_ACCESS_TOKEN}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Geocoding failed with status: ${response.status}`);
            }

            const data: MapboxResponse = await response.json();

            if (data.features && data.features.length > 0) {
                const [longitude, latitude] = data.features[0].geometry.coordinates;
                return { latitude, longitude };
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
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
                const coordinates = await this.getCoordinates(currentaddress);

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

                // const is_idnumber_in_form = await this.formModel.findOne({ idNumber })

                // if (is_idnumber_in_form) return { email: formemail, message: 'ID Number exists in form model.' }
                // const notes = 'Unknown respondent'
                // await this.formModel.create({ idNumber, date_sent: createTime, notes })
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
}
