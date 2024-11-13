import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IPrograms, IPromisePrograms } from './programs.interface'
import { IStudent } from 'src/student/student.interface'
import { IOffered } from 'src/offered/offered.interface';
import { ICurriculum } from 'src/curriculum/curriculum.interface';

@Injectable()
export class ProgramsService {
    constructor(
        @InjectModel('Program') private readonly ProgramModel: Model<IPrograms>,
        @InjectModel('Student') private readonly StudentModel: Model<IStudent>,
        @InjectModel('Offered') private readonly OfferedModel: Model<IOffered>,
        @InjectModel('Curriculum') private readonly CurriculumModel: Model<ICurriculum>,
    ) { }

    decodeBase64(encoded: string): string {
        return Buffer.from(encoded, 'base64').toString('utf-8')
    }

    async getAttritionData(programId: string) {
        try {
            // Verify the program exists
            const program = await this.ProgramModel.findById(programId);
            if (!program) throw new HttpException({ success: false, message: 'Program not found' }, HttpStatus.NOT_FOUND);

            // Get curriculum IDs associated with the program
            const curriculumIds = await this.CurriculumModel.find({ programid: programId }).distinct('_id');

            // Proceed with the aggregation on StudentModel
            const aggregationResult = await this.StudentModel.aggregate([
                // Match students associated with the program's curriculums
                {
                    $match: {
                        program: { $in: curriculumIds }
                    }
                },
                // Project enrollment data
                {
                    $project: {
                        studentId: '$_id',
                        isenrolled: 1,
                        status: 1,
                        enrollmentData: {
                            $map: {
                                input: '$enrollments',
                                as: 'enrollment',
                                in: {
                                    enrollmentYear: { $year: '$$enrollment.enrollmentDate' },
                                    isDiscontinued: {
                                        $eq: ['$$enrollment.ispass', 'discontinue']
                                    }
                                }
                            }
                        }
                    }
                },
                // Unwind enrollmentData
                {
                    $unwind: '$enrollmentData'
                },
                // Group by enrollmentYear and studentId
                {
                    $group: {
                        _id: {
                            enrollmentYear: '$enrollmentData.enrollmentYear',
                            studentId: '$studentId'
                        },
                        isDiscontinued: { $max: '$enrollmentData.isDiscontinued' }
                    }
                },
                // Group by enrollmentYear to get counts
                {
                    $group: {
                        _id: '$_id.enrollmentYear',
                        enrolledCount: { $sum: 1 },
                        discontinuedCount: { $sum: { $cond: ['$isDiscontinued', 1, 0] } }
                    }
                },
                // Calculate attrition rate
                {
                    $addFields: {
                        attritionRate: {
                            $cond: [
                                { $gt: ['$enrolledCount', 0] },
                                { $multiply: [{ $divide: ['$discontinuedCount', '$enrolledCount'] }, 100] },
                                0
                            ]
                        }
                    }
                },
                // Sort by enrollmentYear
                {
                    $sort: {
                        '_id': 1
                    }
                },
                // Group and calculate totals for past 3 years
                {
                    $group: {
                        _id: null,
                        yearlyData: {
                            $push: {
                                academicYear: '$_id',
                                enrolledCount: '$enrolledCount',
                                discontinuedCount: '$discontinuedCount',
                                attritionRate: '$attritionRate'
                            }
                        },
                        past3YearsTotalEnrolled: {
                            $sum: {
                                $cond: [
                                    { $gte: ['$_id', new Date().getFullYear() - 2] },
                                    '$enrolledCount',
                                    0
                                ]
                            }
                        },
                        past3YearsTotalDiscontinued: {
                            $sum: {
                                $cond: [
                                    { $gte: ['$_id', new Date().getFullYear() - 2] },
                                    '$discontinuedCount',
                                    0
                                ]
                            }
                        }
                    }
                },
                // Calculate 3-year attrition rate
                {
                    $addFields: {
                        past3YearsAttritionRate: {
                            $cond: [
                                { $gt: ['$past3YearsTotalEnrolled', 0] },
                                { $multiply: [{ $divide: ['$past3YearsTotalDiscontinued', '$past3YearsTotalEnrolled'] }, 100] },
                                0
                            ]
                        }
                    }
                }
            ]);

            // Process the aggregation result
            const result = aggregationResult[0] || { yearlyData: [], past3YearsTotalEnrolled: 0, past3YearsTotalDiscontinued: 0, past3YearsAttritionRate: 0 };

            // Define start and end years for the past 3 years
            const last3Years = result.yearlyData.slice(-3);
            const startYear = last3Years.length ? last3Years[0]?.academicYear : 'N/A';
            const endYear = last3Years.length ? last3Years[last3Years.length - 1]?.academicYear : 'N/A';

            return {
                success: true,
                data: {
                    _id: program._id,
                    descriptiveTitle: program.descriptiveTitle,
                    code: program.code,
                    residency: program.residency,
                    department: program.department,
                    past3years: {
                        period: `${startYear}-${endYear}`,
                        totalEnrolled: result.past3YearsTotalEnrolled,
                        totalDiscontinued: result.past3YearsTotalDiscontinued,
                        attritionRate: Number(result.past3YearsAttritionRate.toFixed(2))
                    },
                    yearly: result.yearlyData
                }
            };
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch the attrition rate for programs.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    async findAll(): Promise<IPromisePrograms> {
        try {
            const response = await this.ProgramModel.find().sort({ _id: 1 })

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
