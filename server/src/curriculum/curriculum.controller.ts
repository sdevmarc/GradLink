import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { ICurriculum } from './curriculum.interface';

@Controller('curriculum')
export class CurriculumController {
    constructor(
        private readonly CurriculumService: CurriculumService
    ) { }

    @Get('active')
    async findAllActiveCurriculum() {
        return await this.CurriculumService.findAllActive()
    }

    @Get('legacy')
    async findAllInactiveCurriculum() {
        return await this.CurriculumService.findAllLegacy()
    }

    @Post('create')
    async insertCurriculum(@Body() { name, programCode, major, categories }: ICurriculum) {
        return this.CurriculumService.insertNew({ name, programCode, major, categories })
    }
}
