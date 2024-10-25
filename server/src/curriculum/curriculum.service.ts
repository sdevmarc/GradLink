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

    async findAll()
        : Promise<IPromiseCurriculum> {
        try {
            const response = await this.CurriculumModel.find().sort({ updatedAt: -1 })
            return { success: true, message: 'Curriculumns fetched successfully.', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to retrieve curriculums.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // async findAllLegacy()
    //     : Promise<IPromiseCurriculum> {
    //     try {
    //         const response = await this.CurriculumModel.aggregate([
    //             { $match: { isActive: false } },
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     name: 1,
    //                     major: 1,
    //                     programCode: 1,
    //                     isActive: 1,
    //                     createdAt: 1,
    //                     updatedAt: 1
    //                 }
    //             },
    //             { $sort: { createdAt: -1 } }
    //         ])
    //         return { success: true, message: 'Inactive Curriculumns fetched successfully.', data: response }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Failed to retrieve curriculums.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    async insertNew({ name, programCode, major, categories }: ICurriculum) {
        try {
            if (!name || !programCode || categories.length === 0) return { success: false, message: 'Please fill-in the required fields.' }

            const activeCurriculum = await this.CurriculumModel.findOne({ programCode, isActive: true })
            if (activeCurriculum) await this.CurriculumModel.updateMany({ programCode, isActive: true }, { isActive: false })

            await this.CurriculumModel.create({ name, programCode, major, categories })
            return { success: true, message: 'Curriculum successfully created.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create new curriculum.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
