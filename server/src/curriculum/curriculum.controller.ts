import { Controller, Get } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';

@Controller('curriculum')
export class CurriculumController {
    constructor(
        private readonly CurriculumService: CurriculumService
    ) { }

    @Get()
    async findAllCurriculum() {
        return await this.CurriculumService.findAll()
    }

    @Get('check-curriculum')
    async isCurriculumExists() {
        return await this.CurriculumService.isCurriculumExists()
    }
}
