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

    @Post('upsert')
    async InsertStudent(
        @Body() { sid, generalInformation, educationalBackground, trainingAdvanceStudies, programs }: IStudent
    ) {
        return this.studentService.UpsertStudent(
            {
                sid,
                programs,
                generalInformation,
                educationalBackground,
                trainingAdvanceStudies
            }
        )
    }
}
