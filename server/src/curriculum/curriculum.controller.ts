import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { ICurriculum } from './curriculum.interface';

@Controller('curriculum')
export class CurriculumController {
    constructor(
        private readonly CurriculumService: CurriculumService
    ) { }

    @Get()
    async findAllCurriculum() {
        return await this.CurriculumService.findAll()
    }

    @Get('active')
    async findAllActiveCurriculum() {
        return await this.CurriculumService.findAllActive()
    }

    @Post('create')
    async insertCurriculum(@Body() { name, programid, major, categories }: ICurriculum) {
        return this.CurriculumService.insertNew({ name, programid, major, categories })
    }
}
