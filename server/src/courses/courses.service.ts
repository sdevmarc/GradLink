import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICourses, IPromiseCourse } from './courses.interface';

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel('Course') private readonly CourseModel: Model<ICourses>
    ) { }

    async findAll()
        : Promise<IPromiseCourse> {
        try {
            const response = await this.CourseModel.find()
            return { success: true, message: 'Courses successfully fetched.', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to fetch courses.', error }, HttpStatus.BAD_REQUEST)
        }
    }

    async findOne({ courseno }: ICourses)
        : Promise<IPromiseCourse> {
        try {
            const response = await this.CourseModel.findOne({ courseno })
            return { success: true, message: 'Course fetched successfully', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Course failed to fetch.', error }, HttpStatus.BAD_REQUEST)
        }
    }

    async upsert({ courseno, descriptiveTitle, degree, units }: ICourses)
        : Promise<IPromiseCourse> {
        try {
            await this.CourseModel.findOneAndUpdate(
                { courseno },
                { courseno, descriptiveTitle, degree, units },
                { new: true, upsert: true }
            )

            return { success: true, message: 'Course added successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Course failed to upsert.', error }, HttpStatus.BAD_REQUEST)
        }
    }

    async delete({ cid }: ICourses)
        : Promise<IPromiseCourse> {
        try {
            await this.CourseModel.findByIdAndDelete(cid)
            return { success: true, message: 'Course deleted successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Course failed to delete.' }, HttpStatus.BAD_REQUEST)
        }
    }
}
