import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { StudentService } from './student.service'
import { IRequestStudent, IStudent } from './student.interface'
import { FormsService } from 'src/forms/forms.service'
import { ConstantsService } from 'src/constants/constants.service'
import { AuditlogService } from 'src/auditlog/auditlog.service'
import { CoursesService } from 'src/courses/courses.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from 'src/auth/auth.guard'

@Controller('student')
@UseGuards(AuthGuard)
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

    @Post('employment-analytics')
    async findStatisticsForEmployment(@Body() { department, program, academicYear }: { department?: string, program?: string, academicYear?: string }) {
        return this.studentService.findTracerAnalytics({ department, program, academicYear })
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

    @Get('student-overlap')
    async findStudentsOverlap() {
        return await this.studentService.findStudentsOverlapResidency()
    }

    @Get('years-graduated')
    async findAllYearsGraduation() {
        return await this.studentService.findAllYearrGraduated()
    }

    @Post('new-student')
    async createStudentEnrollee(
        @Body() { idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements }: IStudent
    ) {
        try {
            return await this.studentService.createEnrollee({ idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements })
            // const issuccess = await this.studentService.createEnrollee({ idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements })
            // if (issuccess.success) {
            //     await this.auditlogService.createLog({ userId, action: "create", description: `Student created w/ ID no: ${idNumber}` })
            //     return { success: true, message: "Student successfully created." }
            // }
            // await this.auditlogService.createLog({ userId, action: "create", description: 'Error' })
            // return { success: false, message: issuccess.message }

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
            return await this.studentService.enrollStudent({ course, id })
            // const SelectedCourse = await this.coursesService.findOneCourse({ course })
            // const issuccess = await this.studentService.enrollStudent({ course, id })
            // if (issuccess.success) {
            //     await this.auditlogService.createLog({ userId, action: "Enroll", description: `${id.length} student/s was enrolled in ${SelectedCourse.data.descriptiveTitle}` })
            // }

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
        @Body() { userId, evaluations, course }: IRequestStudent
    ) {
        try {
            return await this.studentService.evaluateStudent({ evaluations, course })

            // const SelectedCourse = await this.coursesService.findOneCourse({ course })
            // const issuccess = await this.studentService.evaluateStudent({ evaluations, course })
            // if (issuccess.success) {
            //     await this.auditlogService.createLog({ userId, action: "Evaluate", description: `${evaluations.length} student/s evaluated in ${SelectedCourse.data.descriptiveTitle}` })
            //     return { success: true, message: "Students successfully evaluated." }
            // }
            // await this.auditlogService.createLog({ userId, action: "Evaluate", description: 'Error' })
            // return { success: false, message: issuccess.message }

        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch audit logs.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
        //return await this.studentService.evaluateStudent({ evaluations, course })
    }

    @Post('discontinue-student')
    @UseInterceptors(FileInterceptor('assessmentForm'))
    async discontinueStudent(
        @Body() { id }: { id: string },
        @UploadedFile() assessmentForm: Express.Multer.File
    ) {
        return await this.studentService.discontinueStudent({ id, assessmentForm })
    }

    @Post('send-tracer-to-alumni')
    async findAlumniAndSendTracer(@Body() { academicYear, program }: { academicYear: string, program: string }) {
        return await this.studentService.findAlumniByFilterAndSendTracer({ academicYear, program })
    }

    @Post('activate-student')
    async activateStudent(
        @Body() { studentid }: { studentid: string }
    ) {
        return await this.studentService.activateExistingStudent(studentid)
    }

    @Post('update-graduate')
    async updateStudentGraduate() {
        const response = await this.formService.mapQuestionsToAnswers(this.constantsService.getFormId())

        const updatePromises = response.map(async (item) => {
            const formemail = String(item.generalInformation.answers[8].answer)
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
