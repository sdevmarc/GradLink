import { Body, Controller, Get, Post, Query, ParseIntPipe, Param } from '@nestjs/common';
import { OfferedService } from './offered.service';
import { IOffered } from './offered.interface';

@Controller('offered')
export class OfferedController {
    constructor(
        private readonly offeredService: OfferedService
    ) { }

    @Get()
    async findAllActiveCoursesOffered() {
        return await this.offeredService.findAllActive()
    }

    @Get('academic-years')
    async findAllAcdemicYearsInCoursesOffered() {
        return await this.offeredService.findAllAcademicYears()
    }

    @Get('academic-year/:year')
    async findSemestersInAcademicYear(@Param('year') year: string) {
        return await this.offeredService.findSemestersInAcademicYear({ academicYear: year })
    }

    @Post('create')
    async createOfferedCourses(@Body() { semester, academicYear, courses }: IOffered) {
        return await this.offeredService.createOffered({ semester, academicYear, courses })
    }
}
