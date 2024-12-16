import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { ICurriculum } from './curriculum.interface';
import { AuditlogService } from 'src/auditlog/auditlog.service'
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('curriculum')
// @UseGuards(AuthGuard)
export class CurriculumController {
    constructor(
        private readonly CurriculumService: CurriculumService,
        private readonly auditlogService: AuditlogService,
        private jwtService: JwtService
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
    async insertCurriculum(
        @Req() request: Request,
        @Body() { name, year, programid, major, categories }: ICurriculum) {

        const token = request.cookies['access_token'];
        if (!token) return { isAuthenticated: false }

        try {
            const payload = await this.jwtService.verify(token);
            const userId = await payload.sub

            // return await this.CurriculumService.insertNew({ name, programid, major, categories })
            const issuccess = await this.CurriculumService.insertNew({ name, year, programid, major, categories })

            if (issuccess.success) {
                await this.auditlogService.createLog({ userId, action: "curriculum_changed", description: `Curriculum ${name} created successfully.` })
                return { success: true, message: "Curriculum successfully created." }
            }

            return { success: false, message: issuccess.message }
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch audit logs.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }


    }
}
