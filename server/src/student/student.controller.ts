import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { IStudent } from './student.interface';
import { FormsService } from 'src/forms/forms.service';
import { ConstantsService } from 'src/constants/constants.service';

@Controller('student')
export class StudentController {
    constructor(
        private readonly studentService: StudentService,
        private readonly formService: FormsService,
        private readonly constantsService: ConstantsService
    ) { }

    @Get()
    async findAllStudent() {
        return this.studentService.findAllStudents()
    }

    @Get('enrolled')
    async findAllEnrolledStudent() {
        return this.studentService.findAllStudentsEnrolled()
    }

    @Get('alumni')
    async findAllAlumniStudents() {
        return this.studentService.findAllAlumni()
    }

    @Get('findone/:idNumber')
    async findOneStudent(@Param('idNumber') idNumber: IStudent) {

        return await this.studentService.findOne(idNumber)
    }

    @Post('create')
    async createStudent(
        @Body() { idNumber, name, email, enrollments, isenrolled }: IStudent
    ) {
        return await this.studentService.create(
            {
                idNumber,
                name,
                email,
                enrollments,
                isenrolled
            }
        )
    }

    @Post('unenroll-all')
    async unrollAllStudents() {
        return await this.studentService.unrollAll()
    }

    @Post('unenroll-selection')
    async unrollSelection(@Body() { sid }: IStudent) {
        return await this.studentService.unrollSelection({ sid })
    }

    @Post('unenroll-one/:sid')
    async unrollOne(@Param('sid') { sid }: IStudent) {
        return await this.studentService.unrollOne({ sid })
    }

    @Post('update-graduate')
    async updateStudentGraduate() {
        const response = await this.formService.mapQuestionsToAnswers(this.constantsService.getFormId());

        const updatePromises = response.map(async (item) => {
            const idNumber = String(item.generalInformation.answers[0].answer);
            const { generalInformation, educationalBackground, trainingAdvanceStudies } = item;
            return await this.studentService.formUpdateStudent({
                idNumber,
                generalInformation,
                educationalBackground,
                trainingAdvanceStudies,
            });
        });

        const updateResults = await Promise.all(updatePromises)

        const resultsPromises = updateResults.map(async (item) => {
            const { success, message, idNumber } = item
            if (!success) return await this.studentService.insertFormPending({ idNumber })

            //Testing
            return { success, message }
        })

        const pendingResults = await Promise.all(resultsPromises)
        return pendingResults;
    }
}
