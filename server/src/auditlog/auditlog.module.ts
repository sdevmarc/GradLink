import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditSchema } from './auditlog.schema';
import { AuditlogService } from './auditlog.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Auditlog', schema: AuditSchema },
        ])
    ],
    providers: [
        AuditlogService
    ],
})
export class AuditlogModule { }
