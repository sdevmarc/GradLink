import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { StudentService } from './student.service'
import { IRequestStudent, IStudent } from './student.interface'
import { FormsService } from 'src/forms/forms.service'
import { ConstantsService } from 'src/constants/constants.service'

@Controller('student')
export class StudentController {
    constructor(
        private readonly studentService: StudentService,
        private readonly formService: FormsService,
        private readonly constantsService: ConstantsService,
    ) { }

    @Get()
    async findAllRegisteredStudents() {
        return this.studentService.findAllStudents()
    }

    @Get('enrollees/:id')
    async findAllStudentStatusEnrolleesInCourse(@Param('id') id: string) {
        return this.studentService.findAllEnrolleesInCourse(id)
    }

    @Get('evaluation/:id')
    async findAllStudentsInCourseForEvaluation(@Param('id') id: string) {
        return this.studentService.findAllStudentsInCourseForEvaluation(id)
    }

    @Get('attrition/:id')
    async findAllStudentsInCourseForAttrition(@Param('id') id: string) {
        return this.studentService.findAllStudentsInCourseForAttritionRate(id)
    }

    @Post('filtered-alumni')
    async findAllFilteredAlumni(@Body() { search, program, yeargraduated }: { search: string, program: string, yeargraduated: string }) {
        return this.studentService.findFilteredAlumni({ search, program, yeargraduated })
    }

    @Get('alumni')
    async findAllAlumniGraduates() {
        return this.studentService.findAllAlumni()
    }

    @Get('years-graduated')
    async findAllYearsGraduation() {
        return this.studentService.findAllYearrGraduated()
    }

    @Post('new-student')
    async createStudentEnrollee(
        @Body() { idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements }: IStudent
    ) {
        return await this.studentService.createEnrollee({ idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements })
    }

    @Post('enroll-student')
    async enrollStudentEnrollee(
        @Body() { course, id }: IRequestStudent
    ) {
        return await this.studentService.enrollStudent({ course, id })
    }

    @Post('evaluate-student')
    async evaluateStudentEnrollee(
        @Body() { evaluations, course }: IRequestStudent
    ) {
        return await this.studentService.evaluateStudent({ evaluations, course })
    }

    @Post('activate-student')
    async activateStudent(
        @Body() { studentid }: { studentid: string }
    ) {
        return await this.studentService.activateExisitngStudent(studentid)
    }

    @Post('update-graduate')
    async updateStudentGraduate() {
        const response = await this.formService.mapQuestionsToAnswers(this.constantsService.getFormId())

        const updatePromises = response.map(async (item) => {
            const idNumber = String(item.generalInformation.answers[0].answer)
            const { generalInformation, educationalBackground, employmentData } = item
            return await this.studentService.formUpdateStudent({
                idNumber,
                generalInformation,
                educationalBackground,
                employmentData,
            })
        })

        const updateResults = await Promise.all(updatePromises)

        const resultsPromises = updateResults.map(async (item) => {
            const { success, message, idNumber } = item
            if (!success) return await this.studentService.insertFormPending({ idNumber })

            //Testing
            return { success, message }
        })

        const pendingResults = await Promise.all(resultsPromises)
        return pendingResults
    }
}
