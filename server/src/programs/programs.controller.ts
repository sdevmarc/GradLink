import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { IPrograms } from './programs.interface';

@Controller('programs')
export class ProgramsController {
    constructor(
        private readonly programService: ProgramsService
    ) { }

    @Get()
    async findAllPrograms() {
        return await this.programService.findAll()
    }

    @Get(':code')
    async findOneProgram(@Param() { code }: IPrograms) {
        return await this.programService.findOne({ code })
    }

    @Post('upsert')
    async upsertProgram(
        @Body() { code, descriptiveTitle, residency }: IPrograms
    ) {
        return await this.programService.upsert({ code, descriptiveTitle, residency })
    }

    @Post(':pid')
    async deleteProgram(@Param() { pid }: IPrograms) {
        return this.programService.delete({ pid })
    }
}
