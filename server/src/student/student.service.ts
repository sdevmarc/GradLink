import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPromiseStudent, IStudent, IStudentFormPending } from './student.interface';

@Injectable()
export class StudentService {
    constructor(
        @InjectModel('Student') private readonly studentModel: Model<IStudent>,
        @InjectModel('Form') private readonly formModel: Model<IStudentFormPending>
    ) { }

    async findAll()
        : Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.find()
            return { success: true, message: 'Students sucessfully fetched', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Students failed to fetch.', error }, HttpStatus.BAD_REQUEST)
        }
    }

    async findOne()
        : Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.findOne()
            return { success: true, message: 'Student successfully ', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Student failed to fetch.', error }, HttpStatus.BAD_REQUEST)
        }
    }

    async create(
        { idNumber, name, email, status, enrollments }: IStudent
    ): Promise<IPromiseStudent> {
        try {
            const isstudent = await this.studentModel.findOne({ idNumber })
            if (isstudent) return { success: false, message: 'Student already exists.' }
            await this.studentModel.create({ idNumber, name, email, enrollments, status })
            return { success: true, message: 'Student successfully created.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create student.', error }, HttpStatus.BAD_REQUEST)
        }
    }

    //UNFIXED
    async findByIdAndUpdate(
        { idNumber, status, progress }: IStudent
    )
        : Promise<IPromiseStudent> {
        try {
            const isstudent = await this.studentModel.findOne({ idNumber })
            if (!isstudent) return { success: false, message: 'Student do not exist.' }

            await this.studentModel.findOneAndUpdate(
                { idNumber },
                {
                    idNumber,
                    status,
                    progress
                },
                { new: true }
            )
            return { success: true, message: 'Student successfully updated' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to update student information', error }, HttpStatus.BAD_REQUEST)
        }
    }

    async insertFormPending({ sid })
        : Promise<IPromiseStudent> {
        try {
            await this.formModel.create({ sid })
            return { success: true, message: 'Form pending student created successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create form pending.' }, HttpStatus.BAD_REQUEST)
        }
    }

    async formUpdateStudent(
        { idNumber, generalInformation, educationalBackground, trainingAdvanceStudies }: IStudent
    )
        : Promise<IPromiseStudent> {
        try {
            const isstudent = await this.studentModel.findOne({ idNumber })
            if (!isstudent) return { success: false, message: 'Student do not exist.', idNumber }

            await this.studentModel.findOneAndUpdate(
                { idNumber },
                {
                    generalInformation,
                    educationalBackground,
                    trainingAdvanceStudies,
                    status: 'alumni',
                    progress: 'done'
                },
                { new: true }
            )
            return { success: true, message: 'Student successfully updated', idNumber }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to update student graduate', error }, HttpStatus.BAD_REQUEST)
        }
    }
}
