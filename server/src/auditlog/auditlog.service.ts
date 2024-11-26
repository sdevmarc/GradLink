import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IAuditlog, IPromiseAudit } from './auditlog.interface';
import { Model } from 'mongoose';

@Injectable()
export class AuditlogService {
    constructor(
        @InjectModel('Auditlog') private readonly AuditlogModel: Model<IAuditlog> //Check mo audit log interface, dun ka maglagay ng types niya. Pagbasehan mo yung sa schema, make your own schema kapag.
    ) { }

    async findAll(): Promise<IPromiseAudit> {
        try {
            const response = await this.AuditlogModel.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $project: {
                        _id: 1,
                        name: '$user.name',
                        action: 1,
                        description: 1,
                        updatedAt: 1
                    }
                }, {
                    $sort: {
                        _id: -1
                    }
                }
            ])
            return { success: true, message: 'Audit retrieved successfully.', data: response }
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to find all audit log.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async createLog({ userId, action, description }: IAuditlog): Promise<IPromiseAudit> {
        try {
            await this.AuditlogModel.create({ userId, action, description });
            return { success: true, message: 'Audit successfully' }
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to create audit log.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
