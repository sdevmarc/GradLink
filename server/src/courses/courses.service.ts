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
            throw new HttpException({ success: false, message: 'Failed to fetch courses.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findOne({ courseno }: ICourses)
        : Promise<IPromiseCourse> {
        try {
            const response = await this.CourseModel.findOne({ courseno })
            return { success: true, message: 'Course fetched successfully', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Course failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async create({ courseno, descriptiveTitle, degree, units, pre_req }: ICourses)
        : Promise<IPromiseCourse> {
        try {
            const iscourse = await this.CourseModel.findOne({ courseno })
            if (iscourse) return { success: false, message: 'Course already exist.' }

            await this.CourseModel.create({ courseno, descriptiveTitle, degree, units, pre_req })
            return { success: true, message: 'Course successfully created.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create course.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findByIdAndUpdate({ cid, courseno, descriptiveTitle, degree, units }: ICourses)
        : Promise<IPromiseCourse> {
        try {
            await this.CourseModel.findByIdAndUpdate(
                cid,
                { courseno, descriptiveTitle, degree, units },
                { new: true }
            )

            return { success: true, message: 'Course updated successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Course failed to update.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async delete({ cid }: ICourses)
        : Promise<IPromiseCourse> {
        try {
            await this.CourseModel.findByIdAndDelete(cid)
            return { success: true, message: 'Course deleted successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Course failed to delete.' }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
