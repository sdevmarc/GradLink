import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPromiseSemester, ISemester } from './semester.interface';
import { Model } from 'mongoose';
import { IStudent } from 'src/student/student.interface';
import { ICurriculum } from 'src/curriculum/curriculum.interface';

@Injectable()
export class SemesterService {
    constructor(
        @InjectModel('Semester') private readonly SemesterModel: Model<ISemester>,
        @InjectModel('Student') private readonly StudentModel: Model<IStudent>,
    ) { }

    async isSemesterExists(): Promise<IPromiseSemester> {
        try {
            const response = await this.SemesterModel.find().sort({ updatedAt: -1 })
            if (response.length === 0) return { success: false, message: 'Semester does not exists.' }
            return { success: true, message: 'Semester exists.', data: response[0].semester }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Search for semester if exists failed.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async insert({ semester, studentsEnrolled }: ISemester): Promise<IPromiseSemester> {
        try {
            await this.SemesterModel.create({ semester, studentsEnrolled })
            return { success: true, message: 'Semester updated successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'New semester failed to create.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
