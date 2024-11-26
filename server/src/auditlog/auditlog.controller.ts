import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuditlogService } from './auditlog.service';
import { IAuditlog } from './auditlog.interface';

@Controller('auditlog')
export class AuditlogController {
    constructor(
        private readonly auditlogService: AuditlogService
    ) { }

    @Get()
    async findAllAuditLogs() {
        return await this.auditlogService.findAll()
    }

    @Post('create') 
    async createLog(@Body() logData: IAuditlog) {
        return await this.auditlogService.createLog(logData);
    }
}
