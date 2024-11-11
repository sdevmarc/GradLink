import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { ICurriculum } from './curriculum.interface';
import { AuditlogService } from 'src/auditlog/auditlog.service'

@Controller('curriculum')
export class CurriculumController {
    constructor(
        private readonly CurriculumService: CurriculumService,
        private readonly auditlogService: AuditlogService
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
    async insertCurriculum(@Body() { userId, name, programid, major, categories }: ICurriculum) {
        try {
            return await this.CurriculumService.insertNew({ name, programid, major, categories })
            // const issuccess = await this.CurriculumService.insertNew({ name, programid, major, categories })
            // if(issuccess.success){
            //     await this.auditlogService.createLog({ userId, action: "create", description: `${name} created` })
            //     return { success: true, message: "Curriculum successfully created." }
            // }
            // await this.auditlogService.createLog({ userId, action: "create", description: 'Error creating curriculum' })
            // return { success: false, message: issuccess.message }
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch audit logs.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }


    }
}
