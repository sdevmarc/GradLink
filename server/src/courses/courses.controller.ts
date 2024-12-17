import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common'
import { CoursesService } from './courses.service'
import { ICourses } from './courses.interface'
import { privateDecrypt } from 'crypto'
import { AuditlogService } from 'src/auditlog/auditlog.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('courses')
@UseGuards(AuthGuard)
export class CoursesController {
    constructor(
        private readonly courseService: CoursesService,
        private readonly auditlogService: AuditlogService,
        private jwtService: JwtService
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
    async createCourse(
        @Req() request: Request,
        @Body() { code, courseno, descriptiveTitle, units }: ICourses
    ) {
        const token = request.cookies['access_token'];
        if (!token) return { isAuthenticated: false }

        try {
            const payload = await this.jwtService.verify(token);
            const userId = await payload.sub

            const issuccess = await this.courseService.create({ code, courseno, descriptiveTitle, units })

            if (issuccess.success) {
                await this.auditlogService.createLog({ userId, action: "course_changed", description: `Course created: ${descriptiveTitle}` })
                return { success: true, message: "course successfully created." }
            }

            return { success: false, message: issuccess.message }
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch audit logs.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
