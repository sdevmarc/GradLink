import { Body, Controller, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { IStudent } from './student.interface';
import { FormsService } from 'src/forms/forms.service';

@Controller('student')
export class StudentController {
    constructor(
        private readonly studentService: StudentService,
        private readonly formsService: FormsService
    ) { }

    @Post('create-student')
    async InsertStudent(
        @Body() { sid, programs }: IStudent
    ) {
        return this.studentService.UpsertStudent(
            {
                sid,
                programs,
            }
        )
    }

    @Post('upsert')
    async UpsertStudent(
        @Body() { sid, generalInformation, educationalBackground, trainingAdvanceStudies }: IStudent
    ) {
        return this.studentService.UpsertStudent(
            {
                sid,
                generalInformation,
                educationalBackground,
                trainingAdvanceStudies
            }
        )
    }
}
