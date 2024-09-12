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

    @Post('create')
    async createProgram(
        @Body() { code, descriptiveTitle, residency }: IPrograms
    ) {
        return await this.programService.create({ code, descriptiveTitle, residency })
    }

    @Post('update')
    async updateProgram(
        @Body() { pid, code, descriptiveTitle, residency }: IPrograms
    ) {
        return await this.programService.findByIdAndUpdate({ pid, code, descriptiveTitle, residency })
    }

    @Post(':pid')
    async deleteProgram(@Param() { pid }: IPrograms) {
        return this.programService.delete({ pid })
    }
}
