import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common'
import { ProgramsService } from './programs.service'
import { IPrograms } from './programs.interface'
import { CurriculumService } from 'src/curriculum/curriculum.service'
import { AuditlogService } from 'src/auditlog/auditlog.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('programs')
// @UseGuards(AuthGuard)
export class ProgramsController {
    constructor(
        private readonly programService: ProgramsService,
        private readonly curriculumService: CurriculumService,
        private readonly auditlogService: AuditlogService,
        private jwtService: JwtService
    ) { }

    @Get()
    async findAllPrograms() {
        return await this.programService.findAll()
    }

    @Get('attrition-calculate/:id')
    async findAttritionRateProgram(@Param('id') id: string) {
        return await this.programService.getAttritionData(id)
    }

    // @Get(':id')
    // async findOneProgram(@Param('id') id: string) {
    //     return await this.programService.findOne(id)
    // }

    @Post('create')
    async createProgram(
        @Req() request: Request,
        @Body() { code, descriptiveTitle, residency, department }: IPrograms
    ) {
        const token = request.cookies['access_token'];
        if (!token) return { isAuthenticated: false }

        try {
            const payload = await this.jwtService.verify(token);
            const userId = await payload.sub

            const issuccess = await this.programService.insertNew({ code, descriptiveTitle, residency, department })

            if (issuccess.success) {
                await this.auditlogService.createLog({ userId, action: "program_changed", description: `Created a new program with a code of ${code}` })
                return { success: true, message: "Program successfully created." }
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
