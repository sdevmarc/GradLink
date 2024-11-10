import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditSchema } from './auditlog.schema';
import { AuditlogService } from './auditlog.service';
import { AuditlogController } from './auditlog.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Auditlog', schema: AuditSchema },
        ])
    ],
    providers: [
        AuditlogService
    ],
    controllers: [AuditlogController],
})
export class AuditlogModule { }
