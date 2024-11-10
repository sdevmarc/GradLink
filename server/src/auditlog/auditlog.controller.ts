import { Controller, Post } from '@nestjs/common';
import { AuditlogService } from './auditlog.service';

@Controller('auditlog')
export class AuditlogController {
    constructor(
        private readonly auditlogService: AuditlogService
    ) { }

    @Post('test') //so bali pagtetest mo sa postman to e localhost:3002/auditlog/test
    async sampleApi() {
        return await this.auditlogService.sample()
    }
}
