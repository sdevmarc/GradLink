import { Body, Controller, Get, Post } from '@nestjs/common';
import { OfferedService } from './offered.service';
import { IOffered } from './offered.interface';

@Controller('offered')
export class OfferedController {
    constructor(
        private readonly offeredService: OfferedService
    ) { }

    @Get()
    async findAllActiveCoursesOffered() {
        return this.offeredService.findAllActive()
    }

    @Post('create')
    async createOfferedCourses(@Body() { semester, academicYear, courses }: IOffered) {
        return this.offeredService.createOffered({ semester, academicYear, courses })
    }
}
