import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { IPrograms, IPromisePrograms } from './programs.interface'

@Injectable()
export class ProgramsService {
    constructor(
        @InjectModel('Program') private readonly ProgramModel: Model<IPrograms>,
    ) { }

    // encodeBase64(input: string): string {
    //     return Buffer.from(input, 'utf-8').toString('base64')
    // }

    decodeBase64(encoded: string): string {
        return Buffer.from(encoded, 'base64').toString('utf-8')
    }

    async findAll(): Promise<IPromisePrograms> {
        try {
            const response = await this.ProgramModel.aggregate([
                // Sort by createdAt in descending order
                {
                    $sort: { createdAt: -1 }
                },
                // Lookup curricula for all programs
                {
                    $lookup: {
                        from: 'curriculums',
                        localField: '_id',
                        foreignField: 'programid',
                        as: 'curricula'
                    }
                },
                // Unwind the curricula array
                {
                    $unwind: {
                        path: '$curricula',
                        preserveNullAndEmptyArrays: true
                    }
                },
                // Unwind the categories array
                {
                    $unwind: {
                        path: '$curricula.categories',
                        preserveNullAndEmptyArrays: true
                    }
                },
                // Lookup courses for each category
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'curricula.categories.courses',
                        foreignField: '_id',
                        as: 'curricula.categories.courseDetails'
                    }
                },
                // Group back to reconstruct the documents
                {
                    $group: {
                        _id: '$_id',
                        createdAt: { $first: '$createdAt' },
                        code: { $first: '$code' },
                        descriptiveTitle: { $first: '$descriptiveTitle' },
                        residency: { $first: '$residency' },
                        department: { $first: '$department' },
                        curriculumName: { $first: '$curricula.name' },
                        curriculumId: { $first: '$curricula._id' },
                        major: { $first: '$curricula.major' },
                        isActiveCurriculum: { $first: '$curricula.isActive' },
                        categories: {
                            $push: {
                                $cond: {
                                    if: { $ifNull: ['$curricula.categories', false] },
                                    then: {
                                        categoryName: '$curricula.categories.categoryName',
                                        courses: '$curricula.categories.courseDetails',
                                        totalUnits: {
                                            $reduce: {
                                                input: '$curricula.categories.courseDetails',
                                                initialValue: 0,
                                                in: { $add: ['$$value', '$$this.units'] }
                                            }
                                        }
                                    },
                                    else: '$$REMOVE'
                                }
                            }
                        },
                        totalUnits: {
                            $sum: {
                                $reduce: {
                                    input: '$curricula.categories.courseDetails',
                                    initialValue: 0,
                                    in: { $add: ['$$value', '$$this.units'] }
                                }
                            }
                        }
                    }
                },
                // Sort again after grouping to maintain order
                {
                    $sort: { createdAt: -1 }
                },
                // Project the fields in a nice structure
                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        code: 1,
                        descriptiveTitle: 1,
                        residency: 1,
                        department: 1,
                        totalUnits: 1,
                        curriculum: {
                            _id: '$curriculumId',
                            name: '$curriculumName',
                            major: '$major',
                            isActive: '$isActiveCurriculum',
                            categories: {
                                $filter: {
                                    input: '$categories',
                                    as: 'category',
                                    cond: { $ne: ['$$category', null] }
                                }
                            }
                        }
                    }
                }
            ]);

            return {
                success: true,
                message: 'Programs fetched successfully.',
                data: response
            };
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch all programs.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async insertNew({ code, descriptiveTitle, residency, department }: IPrograms): Promise<IPromisePrograms> {
        try {
            // Normalize inputs early to avoid redundant processing
            const normalizedCode = code.trim().toUpperCase();

            const existingCode = await this.ProgramModel.findOne({ code: normalizedCode })

            if (existingCode) return { success: false, message: 'The code already exists.' }
            if (!department) return { success: false, message: 'Please specify the department.' }


            // Check for existing title
            const existingTitle = await this.ProgramModel.findOne({
                descriptiveTitle: {
                    $regex: `^${descriptiveTitle.trim().replace(/\s+/g, '\\s*')}$`,
                    $options: 'i'
                }
            })

            if (existingTitle) return { success: false, message: 'Descriptive title already exists.' }

            await this.ProgramModel.create({
                code: normalizedCode,
                descriptiveTitle: descriptiveTitle.trim(),
                residency,
                department
            });

            return { success: true, message: 'Program created successfully.' }
        } catch (error) {
            // if (error instanceof MongoError) {
            //     throw new HttpException(
            //         { 
            //             success: false, 
            //             message: 'Database operation failed', 
            //             error: error.message 
            //         }, 
            //         HttpStatus.BAD_REQUEST
            //     );
            // }
            throw new HttpException({ success: false, message: 'Failed to create programs', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
