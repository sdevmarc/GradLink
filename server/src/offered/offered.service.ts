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

    async findAllAcademicYears(): Promise<IPromiseOffered> {
        try {
            const response = await this.offeredModel.aggregate([
                // Project the academic year as a concatenated string
                {
                    $project: {
                        _id: 1,
                        academicYear: {
                            $concat: [
                                { $toString: "$academicYear.startDate" },
                                " - ",
                                { $toString: "$academicYear.endDate" }
                            ]
                        }
                    }
                },
                // Group by the academic year to remove duplicates
                {
                    $group: {
                        _id: "$academicYear",
                        offeredId: { $first: "$_id" }
                    }
                },
                // Sort by academic year (optional)
                {
                    $sort: {
                        academicYear: -1
                    }
                }
            ]);

            return {
                success: true,
                message: 'Academic years fetched successfully.',
                data: response
            }

        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to fetch all academic years.',
                    error
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findSemestersInAcademicYear({ academicYear }: { academicYear: string }): Promise<IPromiseOffered> {
        try {
            // Parse the academic year string (e.g., "2024-2025")
            const [startYear, endYear] = academicYear.split('-').map(year => parseInt(year.trim()));

            const response = await this.offeredModel.aggregate([
                {
                    $match: {
                        'academicYear.startDate': startYear,
                        'academicYear.endDate': endYear
                    }
                },
                {
                    $unwind: '$courses'
                },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'courses',
                        foreignField: '_id',
                        as: 'courseDetails'
                    }
                },
                {
                    $unwind: '$courseDetails'
                },
                {
                    $lookup: {
                        from: 'curriculums',
                        let: { courseId: '$courses' },
                        pipeline: [
                            {
                                $match: {
                                    isActive: true
                                }
                            },
                            {
                                $unwind: '$categories'
                            },
                            {
                                $unwind: '$categories.courses'
                            },
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$categories.courses', '$$courseId']
                                    }
                                }
                            }
                        ],
                        as: 'curriculumInfo'
                    }
                },
                {
                    $unwind: '$curriculumInfo'
                },
                {
                    $lookup: {
                        from: 'programs',
                        localField: 'curriculumInfo.programid',
                        foreignField: '_id',
                        as: 'programInfo'
                    }
                },
                {
                    $unwind: '$programInfo'
                },
                {
                    $project: {
                        _id: '$courseDetails._id',
                        createdAt: '$courseDetails.createdAt',
                        updatedAt: '$courseDetails.updatedAt',
                        academicYears: {
                            $concat: [
                                { $toString: '$academicYear.startDate' },
                                ' - ',
                                { $toString: '$academicYear.endDate' }
                            ]
                        },
                        semesters: '$semester',
                        program: '$curriculumInfo.programid',
                        department: '$programInfo.department',
                        code: '$courseDetails.code',
                        courseno: '$courseDetails.courseno',
                        descriptiveTitle: '$courseDetails.descriptiveTitle',
                        units: '$courseDetails.units',
                        isActive: true
                    }
                }
            ]);

            if (!response || response.length === 0) {
                return {
                    success: false,
                    message: `No courses found for academic year ${academicYear}.`,
                    data: []
                };
            }

            return {
                success: true,
                message: `Courses for academic year ${academicYear} fetched successfully.`,
                data: response
            };

        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: `Failed to fetch all courses for academic year ${academicYear}`,
                    error
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findAllActive(): Promise<any> {
        try {
            const response = await this.offeredModel.aggregate([
                {
                    $match: {
                        isActive: true
                    }
                },
                // Remove the isActive match to include all courses
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
                    $group: {
                        _id: '$course._id',
                        createdAt: { $first: '$createdAt' },
                        updatedAt: { $first: '$updatedAt' },
                        // Store all academic years and semesters in arrays
                        academicYears: { $first: '$academicYear' },
                        semesters: { $first: '$semester' },
                        program: { $first: '$curriculum.programid' },
                        department: { $first: '$program.department' },
                        code: { $first: '$course.code' },
                        courseno: { $first: '$course.courseno' },
                        descriptiveTitle: { $first: '$course.descriptiveTitle' },
                        units: { $first: '$course.units' },
                        isActive: { $first: '$isActive' }
                    }
                },
                {
                    $project: {
                        createdAt: 1,
                        updatedAt: 1,
                        academicYears: 1,
                        semesters: 1,
                        program: 1,
                        department: 1,
                        code: 1,
                        courseno: 1,
                        descriptiveTitle: 1,
                        units: 1,
                        isActive: 1
                    }
                },
                {
                    $sort: {
                        code: -1  // Sort by course number
                    }
                }
            ]);

            return {
                success: true,
                message: 'All courses fetched successfully.',
                data: response
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to fetch active offered courses..',
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
            throw new HttpException({ success: false, message: 'Failed to createl courses offered.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateOffered({ courses }: IOffered): Promise<IPromiseOffered> {
        try {
            await this.offeredModel.findOneAndUpdate(
                { isActive: true },
                { courses },
                { new: true }
            )
            return { success: true, message: 'Offered courses updated successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to update courses offered.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
