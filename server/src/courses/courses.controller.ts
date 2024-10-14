import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ICourses } from './courses.interface';

@Controller('courses')
export class CoursesController {
    constructor(
        private readonly courseService: CoursesService
    ) { }

    @Get()
    async findAllCourses() {
        return this.courseService.findAll()
    }

    @Get(':courseno')
    async findOneCourse(@Param() { courseno }: ICourses) {
        return this.courseService.findOne({ courseno })
    }

    @Post('create')
    async createCourse(@Body() { courseno, descriptiveTitle, programs, units, prerequisites }: ICourses) {
        return this.courseService.create({ courseno, descriptiveTitle, programs, units, prerequisites })
    }

    @Post('update')
    async updateCourse(@Body() { cid, courseno, descriptiveTitle, programs, units }: ICourses) {
        return this.courseService.findByIdAndUpdate({ cid, courseno, descriptiveTitle, programs, units })
    }

    @Post(':cid')
    async deleteCourse(@Param() { cid }: ICourses) {
        return this.courseService.delete({ cid })
    }
}
