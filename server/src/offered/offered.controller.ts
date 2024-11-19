import { Body, Controller, Get, Post, Query, ParseIntPipe, Param, UseGuards } from '@nestjs/common';
import { OfferedService } from './offered.service';
import { IOffered } from './offered.interface';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('offered')
@UseGuards(AuthGuard)
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

    @Post('update')
    async updateOfferedCourses(@Body() { courses }: IOffered) {
        return await this.offeredService.updateOffered({ courses })
    }
}
