import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IAuditlog } from './auditlog.interface';
import { Model } from 'mongoose';

@Injectable()
export class AuditlogService {
    constructor(
        @InjectModel('Auditlog') private readonly AuditlogModel: Model<IAuditlog> //Check mo audit log interface, dun ka maglagay ng types niya. Pagbasehan mo yung sa schema, make your own schema kapag.
    ) { }

    async createLog({ userId, action, description }: IAuditlog): Promise<IAuditlog> {
        try {
            const newLog = new this.AuditlogModel({ userId, action, description });
            return await newLog.save();
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to create audit log.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getAllLogs(): Promise<IAuditlog[]> {
        try {
            return await this.AuditlogModel.find().populate('userId', 'email').sort({ createdAt: -1 }).exec();
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch audit logs.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
