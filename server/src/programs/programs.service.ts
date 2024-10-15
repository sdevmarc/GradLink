import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IPrograms, IPromisePrograms, IRequestPrograms } from './programs.interface'
import { ICurriculum } from 'src/curriculum/curriculum.interface'

@Injectable()
export class ProgramsService {
    constructor(
        @InjectModel('Program') private readonly ProgramModel: Model<IPrograms>,
        @InjectModel('Curriculum') private readonly CurriculumModel: Model<ICurriculum>
    ) { }

    async findAllInActive(): Promise<IPromisePrograms> {
        try {
            const response = await this.CurriculumModel.aggregate([
                { $match: { isActive: true } },
                {
                    $lookup: {
                        from: 'programs',
                        localField: '_id',
                        foreignField: 'curriculumId',
                        as: 'programs'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        isActive: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        programs: {
                            $map: {
                                input: "$programs",
                                as: "program",
                                in: {
                                    _id: "$$program._id",
                                    code: "$$program.code",
                                    descriptiveTitle: "$$program.descriptiveTitle",
                                    residency: "$$program.residency"
                                }
                            }
                        },
                        programCount: { $size: "$programs" },
                    }
                },
                { $sort: { createdAt: -1 } }
            ])
            return { success: true, message: 'Programs for the current curriculum fetched successfully.', data: response[0] }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to fetch all program.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // async findOne({ code }: IPrograms): Promise<IPromisePrograms> {
    //     try {
    //         const response = await this.ProgramModel.findOne({ code })
    //         return { success: true, message: 'Program fetched successfully', data: response }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Failed to fetch all program.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    async validate({ programs }: IRequestPrograms): Promise<IPromisePrograms> {
        try {
            const validationResults = await Promise.all(programs.map(async (item) => {
                const { code, descriptiveTitle, residency } = item
                if (!code || !descriptiveTitle || !residency) return { success: false, message: 'Missing required fields.' }

                const existingProgram = await this.ProgramModel.findOne({ code })
                if (existingProgram) return { success: false, message: `Code ${code} already exists.` }

                return { success: true, message: 'Validation passed.' }
            }))

            const filteredResults = validationResults.filter(item => !item.success)

            const allValid = validationResults.every(result => result.success)
            if (!allValid) return { success: false, message: filteredResults[0].message, data: validationResults }

            return { success: true, message: 'All programs validated successfully.', data: validationResults }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to validate programs', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async insertNew({ programs, curriculumId }: IRequestPrograms): Promise<IPromisePrograms> {
        try {
            if (programs.length === 0) return { success: false, message: 'Programs array is empty.' }

            const createdPrograms = await Promise.all(programs.map(async (item) => {
                const { code, descriptiveTitle, residency } = item
                const newProgram = await this.ProgramModel.create({ code, descriptiveTitle, residency, curriculumId })
                return { success: true, message: `Program ${code} successfully created.`, data: newProgram }
            }))

            return { success: true, message: 'All programs successfully created.', data: createdPrograms }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create programs', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async addProgramToActiveCurriculum({ programs }: IRequestPrograms): Promise<IPromisePrograms> {
        try {
            const activeCurriculum = await this.CurriculumModel.findOne({ isActive: true });
            if (!activeCurriculum) return { success: false, message: 'No active curriculum found.' };
            const createdPrograms = await Promise.all(programs.map(async (item) => {
                const { code, descriptiveTitle, residency } = item
                const newProgram = await this.ProgramModel.create({ code, descriptiveTitle, residency, curriculumId: activeCurriculum._id })
                return { success: true, message: `Program ${code} successfully added in the active curriculum.`, data: newProgram }
            }))

            return { success: true, message: 'All programs successfully added in the active curriculum.', data: createdPrograms }
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to add program to active curriculum', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // async updateActive() {
    //     try {
    //         const findActiveCurriculum = await this.CurriculumModel.findOne({ isActive: true })

    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Failed to update program' }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    // async findByIdAndUpdate({ pid, code, descriptiveTitle, residency }: IPrograms)
    //     : Promise<IPromisePrograms> {
    //     try {
    //         await this.ProgramModel.findByIdAndUpdate(
    //             pid,
    //             { code, descriptiveTitle, residency },
    //             { new: true }
    //         )
    //         return { success: true, message: 'Program successfully updated' }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Failed to update a program.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    // async delete({ pid }: IPrograms)
    //     : Promise<IPromisePrograms> {
    //     try {
    //         await this.ProgramModel.findByIdAndDelete(pid)
    //         return { success: true, message: 'Program deleted successfully.' }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Failed to delete a program.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }
}
