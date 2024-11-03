import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { CoursesService } from './courses.service'
import { ICourses } from './courses.interface'

@Controller('courses')
export class CoursesController {
    constructor(
        private readonly courseService: CoursesService
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
    async createCourse(@Body() { code, courseno, descriptiveTitle, units }: ICourses) {
        return this.courseService.create({ code, courseno, descriptiveTitle, units })
    }
}
