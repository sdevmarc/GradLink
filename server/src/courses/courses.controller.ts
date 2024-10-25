import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ICourses, IRequestCourses } from './courses.interface';

@Controller('courses')
export class CoursesController {
    constructor(
        private readonly courseService: CoursesService
    ) { }

    @Get()
    async findAllCourses() {
        return this.courseService.findAll()
    }

    @Get('courses-offered')
    async findAllCoursesOffered() {
        return this.courseService.findAllCoursesOffered()
    }

    @Get('courses-active-curriculum')
    async findAllCoursesInActiveCurriculum() {
        return this.courseService.findAllCoursesInActiveCurricullum()
    }

    // @Get(':courseno')
    // async findOneCourse(@Param() { courseno }: ICourses) {
    //     return this.courseService.findOne({ courseno })
    // }

    @Post('create')
    async createCourse(@Body() { code, courseno, descriptiveTitle, units, prerequisites }: ICourses) {
        return this.courseService.create({ code, courseno, descriptiveTitle, units, prerequisites })
    }

    @Post('update-courses-offered')
    async updateCourse(@Body() { id }: IRequestCourses) {
        return this.courseService.updateToCourseOffered({ id })
    }

    // @Post(':cid')
    // async deleteCourse(@Param() { cid }: ICourses) {
    //     return this.courseService.delete({ cid })
    // }
}
