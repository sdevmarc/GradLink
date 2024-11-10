import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common'
import { StudentService } from './student.service'
import { IRequestStudent, IStudent } from './student.interface'
import { FormsService } from 'src/forms/forms.service'
import { ConstantsService } from 'src/constants/constants.service'
import { AuditlogService } from 'src/auditlog/auditlog.service'
import { CoursesService } from 'src/courses/courses.service'

@Controller('student')
export class StudentController {
    constructor(
        private readonly studentService: StudentService,
        private readonly formService: FormsService,
        private readonly constantsService: ConstantsService,
        private readonly auditlogService: AuditlogService,
        private readonly coursesService: CoursesService
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

    @Get('alumni')
    async findAllAlumniGraduates() {
        return this.studentService.findAllAlumni()
    }

    @Post('new-student')
    async createStudentEnrollee(
        @Body() { userId, idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements }: IStudent
    ) {
        try {
            const issuccess = await this.studentService.createEnrollee({ idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements })
            if (issuccess.success)
            {
                await this.auditlogService.createLog({ userId, action: "create", description: `Student created w/ ID no: ${idNumber}` })
                return { success: true, message: "Student successfully created." }
            }
            await this.auditlogService.createLog({ userId, action: "create", description: 'Error' })
            return { success: false, message: issuccess.message }

        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch audit logs.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        //return await this.studentService.createEnrollee({ idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements })
    }

    @Post('enroll-student')
    async enrollStudentEnrollee(
        @Body() { userId, course, id }: IRequestStudent
    ) {
        try {
            const SelectedCourse = await this.coursesService.findOneCourse({course})
            const issuccess = await this.studentService.enrollStudent({course, id})
            if(issuccess.success){
                await this.auditlogService.createLog({userId, action: "Enroll", description: `${id.length} student/s was enrolled in ${SelectedCourse.data.descriptiveTitle}`})
            }

        } catch (error) {
                        throw new HttpException(
                { success: false, message: 'Failed to fetch audit logs.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        //console.log(SelectedCourse.data.descriptiveTitle)
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
