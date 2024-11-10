import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IAuditlog } from './auditlog.interface';
import { Model } from 'mongoose';

@Injectable()
export class AuditlogService {
    constructor(
        @InjectModel('Auditlog') private readonly AuditlogModel: Model<IAuditlog>
    ) { }

    async sample() {
        try {

        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to fetch all courses.', error }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
