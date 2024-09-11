import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

    @Post('upsert')
    async upsertCourse(@Body() { courseno, descriptiveTitle, degree, units }: ICourses) {
        return this.courseService.upsert({ courseno, descriptiveTitle, degree, units })
    }

    @Post(':cid')
    async deleteCourse(@Param() { cid }: ICourses) {
        return this.courseService.delete({ cid })
    }
}
