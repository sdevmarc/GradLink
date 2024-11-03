import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ProgramsService } from './programs.service'
import { IPrograms } from './programs.interface'
import { CurriculumService } from 'src/curriculum/curriculum.service'

@Controller('programs')
export class ProgramsController {
    constructor(
        private readonly programService: ProgramsService,
        private readonly curriculumService: CurriculumService
    ) { }

    @Get()
    async findAllPrograms() {
        return await this.programService.findAll()
    }

    @Post('create')
    async createProgram(
        @Body() { code, descriptiveTitle, residency, department }: IPrograms
    ) {
        return await this.programService.insertNew({ code, descriptiveTitle, residency, department })
    }
}
