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
            const yearlyData = [];
            let past3YearsTotalEnrolled = 0;
            let past3YearsTotalDiscontinued = 0;

            // Verify program exists
            const program = await this.ProgramModel.findById(programId);
            if (!program) {
                throw new HttpException(
                    { success: false, message: 'Program not found' },
                    HttpStatus.NOT_FOUND
                );
            }

            // Get all academic years for the program
            const offeredYears = await this.OfferedModel.find()
                .sort({ 'academicYear.startDate': 1 })
                .lean();

            if (!offeredYears.length) {
                throw new HttpException(
                    { success: false, message: 'No academic years found' },
                    HttpStatus.NOT_FOUND
                );
            }

            // Process each academic year
            for (const year of offeredYears) {
                const startDate = new Date(year.academicYear.startDate, 0, 1); // January 1st
                const endDate = new Date(year.academicYear.endDate, 11, 31);  // December 31st

                // Get enrolled students count
                const enrolledCount = await this.StudentModel.countDocuments({
                    program: programId,
                    isenrolled: true,
                    'enrollments.enrollmentDate': {
                        $gte: startDate,
                        $lte: endDate
                    }
                });

                // Get discontinued students count
                const discontinuedCount = await this.StudentModel.countDocuments({
                    program: programId,
                    isenrolled: false,
                    'enrollments.enrollmentDate': {
                        $gte: startDate,
                        $lte: endDate
                    }
                });

                const attritionRate = enrolledCount > 0
                    ? (discontinuedCount / enrolledCount) * 100
                    : 0;

                yearlyData.push({
                    academicYear: `${year.academicYear.startDate}-${year.academicYear.endDate}`,
                    enrolledCount,
                    discontinuedCount,
                    attritionRate: Number(attritionRate.toFixed(2))
                });

                // Add to 3-year totals if in last 3 years
                if (yearlyData.length >= offeredYears.length - 3) {
                    past3YearsTotalEnrolled += enrolledCount;
                    past3YearsTotalDiscontinued += discontinuedCount;
                }
            }

            // Calculate 3-year attrition rate
            const past3YearsAttritionRate = past3YearsTotalEnrolled > 0
                ? (past3YearsTotalDiscontinued / past3YearsTotalEnrolled) * 100
                : 0;

            const last3Years = yearlyData.slice(-3);
            const startYear = last3Years[0]?.academicYear.split('-')[0];
            const endYear = last3Years[last3Years.length - 1]?.academicYear.split('-')[1];

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
                        totalEnrolled: past3YearsTotalEnrolled,
                        totalDiscontinued: past3YearsTotalDiscontinued,
                        attritionRate: Number(past3YearsAttritionRate.toFixed(2))
                    },
                    yearly: yearlyData
                }
            };
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch the attrition rate for programs.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    };



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
