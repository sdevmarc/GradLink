import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { StudentService } from './student.service'
import { IPromiseStudent, IRequestStudent, IStudent } from './student.interface'
import { FormsService } from 'src/forms/forms.service'
import { ConstantsService } from 'src/constants/constants.service'
import { AuditlogService } from 'src/auditlog/auditlog.service'
import { CoursesService } from 'src/courses/courses.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from 'src/auth/auth.guard'
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('student')
@UseGuards(AuthGuard)
export class StudentController {
    constructor(
        private readonly studentService: StudentService,
        private readonly formService: FormsService,
        private readonly constantsService: ConstantsService,
        private readonly auditlogService: AuditlogService,
        private readonly coursesService: CoursesService,
        private jwtService: JwtService
    ) { }

    @Get()
    async findAllRegisteredStudents() {
        return this.studentService.findAllStudents()
    }

    @Get('details/:id')
    async findOneStudentInformation(@Param('id') id: string) {
        return this.studentService.findOneStudent({ id })
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
        @Req() request: Request,
        @Body() { idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements }: IStudent
    ) {

        const token = request.cookies['access_token'];
        if (!token) return { isAuthenticated: false }

        try {
            const payload = await this.jwtService.verify(token);
            const userId = await payload.sub

            // return await this.studentService.createEnrollee({ idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements })
            const issuccess = await this.studentService.createEnrollee({ idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements })
            if (issuccess.success) {
                await this.auditlogService.createLog({ userId, action: "student_changed", description: `Student created w/ ID no: ${idNumber}` })
                return { success: true, message: "Student successfully created." }
            }
            // await this.auditlogService.createLog({ userId, action: "create", description: 'Error' })
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
        @Req() request: Request,
        @Body() { course, id }: IRequestStudent
    ) {
        const token = request.cookies['access_token'];
        if (!token) return { isAuthenticated: false }

        try {
            const payload = await this.jwtService.verify(token);
            const userId = await payload.sub

            // return await this.studentService.enrollStudent({ course, id })
            const SelectedCourse = await this.coursesService.findOneCourse({ course })
            const issuccess = await this.studentService.enrollStudent({ course, id })

            if (issuccess.success) {
                await this.auditlogService.createLog({ userId, action: "student_changed", description: `${id.length} student/s was enrolled in ${SelectedCourse.data.descriptiveTitle}` })
                return { success: true, message: "Student successfully enrolled." }
            }

            return { success: true, message: "Student failed to enroll." }

        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch audit logs.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
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


    @Post('update-student')
    async updateStudent(
        @Body() { id, lastname, firstname, middlename, undergraduateInformation }: IStudent
    ) {
        return await this.studentService.updateStudent({ id, lastname, firstname, middlename, undergraduateInformation })
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
