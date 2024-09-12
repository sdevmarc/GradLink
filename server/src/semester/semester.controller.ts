import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { ISemester } from './semester.interface';

@Controller('semester')
export class SemesterController {
    constructor(
        private readonly semesterService: SemesterService
    ) { }

    @Get()
    async findAllSemester() {
        return this.semesterService.findAll()
    }

    @Get(':semester')
    async findOneSemester(@Param() { semester }: ISemester) {
        return this.semesterService.findOne({ semester })
    }

    @Post('create')
    async createSemester(@Body() { semester, academic_year }: ISemester) {
        return this.semesterService.create({ semester, academic_year })
    }

    @Post('update')
    async updateSemester(@Body() { sid, semester, academic_year }: ISemester) {
        return this.semesterService.findByIdAndUpdate({ sid, semester, academic_year })
    }

    @Post(':sid')
    async deleteSemester(@Param() { sid }: ISemester) {
        return this.semesterService.delete({ sid })
    }
}
