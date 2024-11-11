import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common'
import { ProgramsService } from './programs.service'
import { IPrograms } from './programs.interface'
import { CurriculumService } from 'src/curriculum/curriculum.service'
import { AuditlogService } from 'src/auditlog/auditlog.service'

@Controller('programs')
export class ProgramsController {
    constructor(
        private readonly programService: ProgramsService,
        private readonly curriculumService: CurriculumService,
        private readonly auditlogService: AuditlogService
    ) { }

    @Get()
    async findAllPrograms() {
        return await this.programService.findAll()
    }

    // @Get(':id')
    // async findOneProgram(@Param('id') id: string) {
    //     return await this.programService.findOne(id)
    // }

    @Post('create')
    async createProgram(
        @Body() { userId, code, descriptiveTitle, residency, department }: IPrograms
    ) {
        try {
            return await this.programService.insertNew({ code, descriptiveTitle, residency, department })
            // const issuccess = await this.programService.insertNew({ code, descriptiveTitle, residency, department })

            // if (issuccess.success) {
            //     await this.auditlogService.createLog({ userId, action: "create", description: `Program created is ${code}` })
            //     return { success: true, message: "Program successfully created." }
            // }
            // await this.auditlogService.createLog({ userId, action: "create", description: 'Error' })
            // return { success: false, message: issuccess.message }

        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch audit logs.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
