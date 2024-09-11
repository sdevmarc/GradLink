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

    @Post('upsert-semester')
    async upsertSemester(@Body() { semester, programs }: ISemester) {
        return this.semesterService.upsert({ semester, programs })
    }

    @Post(':sid')
    async deleteSemester(@Param() { sid }: ISemester) {
        return this.semesterService.delete({ sid })
    }
}
