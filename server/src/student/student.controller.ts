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

    @Get('alumni-tracer/:findOne')
    async findAlumniFromTracer(@Param('findOne') id: string) {
        return this.studentService.findOneAlumniFromTracerMap({ id })
    }

    @Get('alumni-for-tracer-map')
    async findAllAlumniForTracerMap() {
        return await this.studentService.findAllAlumniForTracerMap()
    }

    @Get('enrollees/:id')
    async findAllStudentStatusEnrolleesInCourse(@Param('id') id: string) {
        return await this.studentService.findAllEnrolleesInCourse(id)
    }

    @Get('evaluation/:id')
    async findAllStudentsInCourseForEvaluation(@Param('id') id: string) {
        return await this.studentService.findAllStudentsInCourseForEvaluation(id)
    }

    @Get('attrition/:id')
    async findAllStudentsInCourseForAttrition(@Param('id') id: string) {
        return await this.studentService.findAllStudentsInCourseForAttritionRate(id)
    }

    @Post('filtered-alumni')
    async findAllFilteredAlumni(@Body() { search, program, yeargraduated }: { search: string, program: string, yeargraduated: string }) {
        return await this.studentService.findFilteredAlumni({ search, program, yeargraduated })
    }

    @Get('alumni')
    async findAllAlumniGraduates() {
        return await this.studentService.findAllAlumni()
    }

    @Get('years-graduated')
    async findAllYearsGraduation() {
        return await this.studentService.findAllYearrGraduated()
    }

    @Post('new-student')
    async createStudentEnrollee(
        @Body() { userId, idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements }: IStudent
    ) {
        try {
            const issuccess = await this.studentService.createEnrollee({ idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements })
            if (issuccess.success) {
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
    }

    @Post('enroll-student')
    async enrollStudentEnrollee(
        @Body() { userId, course, id }: IRequestStudent
    ) {
        try {
            const SelectedCourse = await this.coursesService.findOneCourse({ course })
            const issuccess = await this.studentService.enrollStudent({ course, id })
            if (issuccess.success) {
                await this.auditlogService.createLog({ userId, action: "Enroll", description: `${id.length} student/s was enrolled in ${SelectedCourse.data.descriptiveTitle}` })
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
            const formemail = String(item.generalInformation.answers[6].answer)
            const {
                generalInformation,
                // educationalBackground, 
                employmentData
            } = item
            return await this.studentService.formUpdateStudent({
                email: formemail,
                generalInformation,
                // educationalBackground,
                employmentData,
            })
        })

        const updateResults = await Promise.all(updatePromises)

        const resultsPromises = updateResults.map(async (item) => {
            const {
                success,
                message,
                // email 
            } = item
            if (!success) {
                // return await this.studentService.insertFormPending({ idNumber })
                return { success: false, message }
            }

            //Testing
            return { success, message }
        })

        // const pendingResults = await Promise.all(resultsPromises)
        // return pendingResults
        return resultsPromises
    }
}
