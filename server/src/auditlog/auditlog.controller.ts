import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuditlogService } from './auditlog.service';
import { IAuditlog } from './auditlog.interface';

@Controller('auditlog')
export class AuditlogController {
    constructor(
        private readonly auditlogService: AuditlogService
    ) { }

    // POST endpoint to create a new audit log entry
    @Post('create')  // Accessible via POST /auditlog/create
    async createLog(@Body() logData: IAuditlog) {
        return await this.auditlogService.createLog(logData);
    }

    // GET endpoint to retrieve all audit logs
    @Get('')  // Accessible via GET /auditlog/all
    async getAllLogs() {
        return await this.auditlogService.getAllLogs();
    }

}
