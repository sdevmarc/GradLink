import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPromiseSemester, ISemester } from './semester.interface';

@Injectable()
export class SemesterService {
    constructor(
        @InjectModel('Semester') private readonly SemesterModel: Model<ISemester>
    ) { }

    async findAll()
        : Promise<IPromiseSemester> {
        try {
            const response = await this.SemesterModel.find()
            return { success: true, message: 'Semester successfully fetched.', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Semester failed to fetch.', error }, HttpStatus.BAD_REQUEST)
        }
    }

    async findOne({ semester }: ISemester)
        : Promise<IPromiseSemester> {
        try {
            const response = await this.SemesterModel.findOne({ semester })
            return { success: true, message: 'Semester successfully fetched.', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Semester failed to fetch one.' }, HttpStatus.BAD_REQUEST)
        }
    }

    async upsert({ semester, programs }: ISemester)
        : Promise<IPromiseSemester> {
        try {
            await this.SemesterModel.findOneAndUpdate(
                { semester },
                { semester, programs },
                { new: true, upsert: true }
            )
            return { success: true, message: 'Semester successfully upserted.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Semester failed to upsert.' }, HttpStatus.BAD_REQUEST)
        }
    }

    async delete({ sid }: ISemester)
        : Promise<IPromiseSemester> {
        try {
            await this.SemesterModel.findByIdAndDelete(sid)
            return { success: true, message: 'Semester successfully deleted.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Semester successfully deleted.' }, HttpStatus.BAD_REQUEST)
        }
    }
}
