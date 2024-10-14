import { Controller, Get } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';

@Controller('curriculum')
export class CurriculumController {
    constructor(
        private readonly CurriculumService: CurriculumService
    ) { }

    @Get()
    async findAllCurriculum() {
        return this.CurriculumService.findAll()
    }
}
