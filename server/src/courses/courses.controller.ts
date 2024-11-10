import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { CoursesService } from './courses.service'
import { ICourses } from './courses.interface'
import { privateDecrypt } from 'crypto'
import { AuditlogService } from 'src/auditlog/auditlog.service'

@Controller('courses')
export class CoursesController {
    constructor(
        private readonly courseService: CoursesService,
        private readonly auditlogService: AuditlogService
    ) { }

    @Get()
    async findAllCourses() {
        return this.courseService.findAll()
    }

    @Get('courses-active-curriculum')
    async findAllCoursesInActiveCurriculum() {
        return this.courseService.findAllCoursesInActiveCurricullum()
    }

    @Get('courses-additional/:curriculumid')
    async findAllCoursesAddtional(@Param('curriculumid') curriculumid: string) {
        return this.courseService.findAllCoursesForAdditional({ curriculumid })
    }

    @Post('create')
    async createCourse(@Body() { userId, code, courseno, descriptiveTitle, units }: ICourses) {
        const issuccess = await this.courseService.create({ code, courseno, descriptiveTitle, units })
        try {
            if(issuccess.success){
                await this.auditlogService.createLog({ userId, action: "create", description: `Course created: ${descriptiveTitle}` })
                return { success: true, message: "course successfully created." }
            }
            await this.auditlogService.createLog({ userId, action: "create", description: 'Error' })
            return { success: false, message: issuccess.message }
        } catch (error) 
        {
            throw new HttpException(
                { success: false, message: 'Failed to fetch audit logs.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
