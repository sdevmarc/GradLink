import { Body, Controller, Get, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { IStudent } from './student.interface';
import { FormsService } from 'src/forms/forms.service';

@Controller('student')
export class StudentController {
    constructor(
        private readonly studentService: StudentService,
        private readonly formService: FormsService
    ) { }

    @Post('create')
    async createStudent(
        @Body() { idNumber, generalInformation, educationalBackground, trainingAdvanceStudies }: IStudent
    ) {
        return await this.studentService.create(
            {
                idNumber,
                generalInformation,
                educationalBackground,
                trainingAdvanceStudies
            }
        )
    }

    @Post('update')
    async updateStudent(
        @Body() { idNumber, status, progress }: IStudent
    ) {
        return await this.studentService.findByIdAndUpdate(
            {
                idNumber,
                status,
                progress
            }
        )
    }

    @Get('update-graduate')
    async updateStudentGraduate() {
        console.log(process.env.FORM_ID)
        const response = await this.formService.mapQuestionsToAnswers(process.env.FORM_ID)
        return response
        // return await this.studentService.formUpdateStudent(
        //     {
        //         idNumber,
        //         generalInformation,
        //         educationalBackground,
        //         trainingAdvanceStudies,
        //     }
        // )
    }
}
