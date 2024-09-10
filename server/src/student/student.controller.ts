import { Body, Controller, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { IStudent } from './student.interface';

@Controller('student')
export class StudentController {
    constructor(
        private readonly studentService: StudentService
    ) { }

    @Post('upsert')
    async UpsertStudent(
        @Body() { sid, generalInformation, educationalBackground, trainingAdvanceStudies, programs, status, progress }: IStudent
    ) {
        return this.studentService.UpsertStudent(
            {
                sid,
                generalInformation,
                educationalBackground,
                trainingAdvanceStudies,
                programs,
                status,
                progress
            }
        )
    }
}
