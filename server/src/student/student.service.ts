import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPromiseStudent, IStudent } from './student.interface';

@Injectable()
export class StudentService {
    constructor(
        @InjectModel('Student') private readonly studentModel: Model<IStudent>
    ) { }

    async UpsertStudent(
        { sid, generalInformation, educationalBackground, trainingAdvanceStudies, programs, status, progress }: IStudent
    )
        : Promise<IPromiseStudent> {
        try {
            await this.studentModel.findOneAndUpdate(
                { sid },
                {
                    sid,
                    generalInformation,
                    educationalBackground,
                    trainingAdvanceStudies,
                    programs,
                    status,
                    progress
                },
                { new: true, upsert: true }
            )
            return { success: true, message: 'Student successfully updated' }
        } catch (error) {
            throw new HttpException({ success: false, message: error }, HttpStatus.BAD_REQUEST)
        }
    }
}
