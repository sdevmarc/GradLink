import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ProgramsService } from './programs.service'
import { IPrograms, IRequestPrograms } from './programs.interface'
import { CurriculumService } from 'src/curriculum/curriculum.service'

@Controller('programs')
export class ProgramsController {
    constructor(
        private readonly programService: ProgramsService,
        private readonly curriculumService: CurriculumService
    ) { }

    @Get()
    async findAllPrograms() {
        return await this.programService.findAllInActive()
    }

    @Get(':id')
    async findOneProgram(@Param() { id }: { id: string }) {
        const decoded = this.programService.decodeBase64(id)
        return await this.programService.findOne({ id: decoded })
    }

    @Post('create')
    async createProgram(
        @Body() { name, programs }: IRequestPrograms
    ) {
        console.log({ name, programs })
        const validationResult = await this.programService.validate({ programs })
        if (!validationResult.success) return validationResult

        const { data } = await this.curriculumService.insertNew({ name })
        return await this.programService.insertNew({ programs, curriculumId: data.toString() })
    }

    @Post('add-program-to-active-curriculum')
    async AddToActiveCurriculum(
        @Body() { programs }: IRequestPrograms
    ) {
        const validationResult = await this.programService.validate({ programs })
        if (!validationResult.success) return validationResult

        return await this.programService.addProgramToActiveCurriculum({ programs })
    }

    // @Post('update')
    // async updateProgram(
    //     @Body() { pid, code, descriptiveTitle, residency }: IPrograms
    // ) {
    //     return await this.programService.findByIdAndUpdate({ pid, code, descriptiveTitle, residency })
    // }

    // @Post(':pid')
    // async deleteProgram(@Param() { pid }: IPrograms) {
    //     return this.programService.delete({ pid })
    // }
}
