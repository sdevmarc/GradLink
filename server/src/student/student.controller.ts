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

    @Get()
    async findAllStudent() {
        return this.studentService.findAll()
    }

    @Post('create')
    async createStudent(
        @Body() { idNumber, enrollments, status }: IStudent
    ) {
        return await this.studentService.create(
            {
                idNumber,
                enrollments,
                status
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

    @Post('update-graduate')
    async updateStudentGraduate() {
        const response = await this.formService.mapQuestionsToAnswers(process.env.FORM_ID);

        const updatePromises = response.map(async (item) => {
            const idNumber = String(item.generalInformation.answers[0].answer);
            const { generalInformation, educationalBackground, trainingAdvanceStudies } = item;
            return this.studentService.formUpdateStudent({
                idNumber,
                generalInformation,
                educationalBackground,
                trainingAdvanceStudies,
            });
        });

        const updateResults = await Promise.all(updatePromises)

        const resultsPromises = updateResults.map(async (item) => {
            const { success, message, idNumber } = item
            if (!success) return await this.studentService.insertFormPending({ sid: idNumber })
            return {}
        })

        const pendingResults = await Promise.all(resultsPromises)
        return pendingResults;
    }
}
