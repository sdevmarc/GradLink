import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOffered, IPromiseOffered } from './offered.interface';
import { ICourses } from 'src/courses/courses.interface';

@Injectable()
export class OfferedService {
    constructor(
        @InjectModel('Offered') private readonly offeredModel: Model<IOffered>,
        @InjectModel('Course') private readonly courseModel: Model<ICourses>,
    ) { }

    async findAllActive(): Promise<any> {
        try {
            const response = await this.offeredModel.aggregate([
                {
                    $match: { isActive: true }
                },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'courses',
                        foreignField: '_id',
                        as: 'course'
                    }
                },
                {
                    $unwind: '$course'
                },
                {
                    $lookup: {
                        from: 'curriculums',
                        localField: 'course._id',
                        foreignField: 'categories.courses',
                        as: 'curriculum'
                    }
                },
                {
                    $unwind: '$curriculum'
                },
                {
                    $lookup: {
                        from: 'programs',
                        localField: 'curriculum.programid',
                        foreignField: '_id',
                        as: 'program'
                    }
                },
                {
                    $unwind: '$program'
                },
                {
                    $match: {
                        'curriculum.isActive': true
                    }
                },
                {
                    $project: {
                        createdAt: 1,
                        updatedAt: 1,
                        academicYear: 1,
                        semester: 1,
                        program: '$curriculum.programid',
                        department: '$program.department',  // Changed to get department from program
                        _id: '$course._id',
                        code: '$course.code',
                        courseno: '$course.courseno',
                        descriptiveTitle: '$course.descriptiveTitle',
                        units: '$course.units'
                    }
                }
            ]);

            return {
                success: true,
                message: 'Courses offered fetched successfully.',
                data: response
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to fetch all programs.',
                    error
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async createOffered({ semester, academicYear, courses }: IOffered)
        : Promise<IPromiseOffered> {
        try {
            if (!semester) return { success: false, message: 'Semester is empty, please fill-in the required field.' }
            if (isNaN(semester)) return { success: false, message: 'Semester must be a number.' }

            const { startDate, endDate } = academicYear
            if (!startDate) return { success: false, message: 'Start date is empty, please fill-in the required field.' }
            if (!endDate) return { success: false, message: 'End date is empty, please fill-in the required field.' }

            const existingOffered = await this.offeredModel.findOne({
                semester,
                'academicYear.startDate': startDate,
                'academicYear.endDate': endDate
            })

            if (existingOffered) return { success: false, message: 'A course offering with the same semester and academic year already exists.' };

            await this.offeredModel.updateMany({ isActive: false })
            await this.offeredModel.create({ semester, academicYear, courses })
            return { success: true, message: 'Courses offered successfully created' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to fetch all courses offered.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
