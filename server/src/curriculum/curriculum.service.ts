import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICurriculum, IPromiseCurriculum } from './curriculum.interface';

@Injectable()
export class CurriculumService {
    constructor(
        @InjectModel('Curriculum') private readonly CurriculumModel: Model<ICurriculum>
    ) { }

    async findAll()
        : Promise<IPromiseCurriculum> {
        try {
            const response = await this.CurriculumModel.find().sort({ _id: -1 });
            return { success: true, message: 'Curriculumns fetched successfully.', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to retrieve curriculums.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async insertNew({ name }: ICurriculum) {
        try {
            if (!name) return { success: false, message: 'Please fill-in the required fields.' }

            await this.CurriculumModel.updateMany({ isActive: true }, { isActive: false, isLegacy: true });
            const { _id } = await this.CurriculumModel.create({ name })

            return { success: true, message: 'Curriculum successfully created.', data: _id }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create new curriculum.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // async update() {
    //     try {

    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Failed to create new curriculum.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }
}
