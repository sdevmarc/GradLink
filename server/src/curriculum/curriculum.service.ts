import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ICurriculum, IPromiseCurriculum } from './curriculum.interface'
import { ICourses } from 'src/courses/courses.interface'

@Injectable()
export class CurriculumService {
    constructor(
        @InjectModel('Curriculum') private readonly CurriculumModel: Model<ICurriculum>,
        @InjectModel('Course') private readonly courseModel: Model<ICourses>,
    ) { }

    async findAll(): Promise<IPromiseCurriculum> {
        try {
            const response = await this.CurriculumModel.aggregate([
                {
                    $lookup: {
                        from: 'programs',
                        localField: 'programid',
                        foreignField: '_id',
                        as: 'programdetails'
                    }
                },
                {
                    $unwind: '$programdetails'
                },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'categories.courses',
                        foreignField: '_id',
                        as: 'allCourses'
                    }
                },
                {
                    $addFields: {
                        'categories': {
                            $map: {
                                input: '$categories',
                                as: 'category',
                                in: {
                                    categoryName: '$$category.categoryName',
                                    courses: {
                                        $filter: {
                                            input: '$allCourses',
                                            as: 'course',
                                            cond: {
                                                $in: ['$$course._id', '$$category.courses']
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        residency: '$programdetails.residency',
                        programid: 1,
                        program: '$programdetails.descriptiveTitle',
                        createdAt: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
                        updatedAt: 1,
                        major: 1,
                        department: '$programdetails.department',
                        isActive: 1,
                        totalOfUnits: { 
                            $sum: '$allCourses.units' 
                        },
                        categories: {
                            $map: {
                                input: '$categories',
                                as: 'category',
                                in: {
                                    categoryName: '$$category.categoryName',
                                    courses: {
                                        $map: {
                                            input: '$$category.courses',
                                            as: 'course',
                                            in: {
                                                _id: '$$course._id',
                                                code: '$$course.code',
                                                descriptiveTitle: '$$course.descriptiveTitle',
                                                units: '$$course.units'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
            ]);
    
            return { 
                success: true, 
                message: 'Curriculums fetched successfully.', 
                data: response 
            };
        } catch (error) {
            throw new HttpException(
                { 
                    success: false, 
                    message: 'Failed to retrieve curriculums.', 
                    error 
                }, 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findAllActive()
        : Promise<IPromiseCurriculum> {
        try {
            const response = await this.CurriculumModel.aggregate([
                {
                    $match: {
                        isActive: true
                    }
                },
                {
                    $lookup: {
                        from: 'programs',
                        localField: 'programid',
                        foreignField: '_id',
                        as: 'programdetails'
                    }
                },
                {
                    $unwind: '$programdetails'
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        program: '$programdetails.descriptiveTitle',
                        createdAt: 1,
                        updatedAt: 1,
                        major: 1,
                        categories: 1,
                        isActive: 1
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ])

            return { success: true, message: 'Curriculumns fetched successfully.', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to retrieve curriculums.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async insertNew({ name, year, programid, major, categories }: ICurriculum) {
        try {
            if (!name || !programid || categories.length === 0) return { success: false, message: 'Please fill-in the required fields.' }

            const activeCurriculum = await this.CurriculumModel.findOne({ programid, isActive: true })
            if (activeCurriculum) await this.CurriculumModel.updateMany({ programid, isActive: true }, { isActive: false })

            await this.CurriculumModel.create({ name, year, programid, major, categories })
            return { success: true, message: 'Curriculum successfully created.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create new curriculum.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
