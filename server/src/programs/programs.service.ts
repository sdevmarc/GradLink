import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPrograms, IPromisePrograms } from './programs.interface';

@Injectable()
export class ProgramsService {
    constructor(
        @InjectModel('Program') private readonly ProgramModel: Model<IPrograms>
    ) { }

    async findAll(): Promise<IPromisePrograms> {
        try {
            const response = await this.ProgramModel.find()
            return { success: true, message: 'Programs fetched successfully.', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to fetch all program.', error }, HttpStatus.BAD_REQUEST)
        }
    }

    async findOne({ code }: IPrograms): Promise<IPromisePrograms> {
        try {
            const response = await this.ProgramModel.findOne({ code })
            return { success: true, message: 'Program fetched successfully', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to fetch all program.', error }, HttpStatus.BAD_REQUEST)
        }
    }

    async create({ code, descriptiveTitle, residency }: IPrograms)
        : Promise<IPromisePrograms> {
        try {
            const isprogram = await this.ProgramModel.findOne({ code })
            if (isprogram) return { success: false, message: 'Program already exist.' }
            await this.ProgramModel.create({ code, descriptiveTitle, residency })
            return { success: true, message: 'Program successfully created.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create program' }, HttpStatus.BAD_REQUEST)
        }
    }

    async findByIdAndUpdate({ pid, code, descriptiveTitle, residency }: IPrograms)
        : Promise<IPromisePrograms> {
        try {
            await this.ProgramModel.findByIdAndUpdate(
                pid,
                { code, descriptiveTitle, residency },
                { new: true }
            )
            return { success: true, message: 'Program successfully updated' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to update a program.', error }, HttpStatus.BAD_REQUEST)
        }
    }

    async delete({ pid }: IPrograms)
        : Promise<IPromisePrograms> {
        try {
            await this.ProgramModel.findByIdAndDelete(pid)
            return { success: true, message: 'Program deleted successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to delete a program.', error }, HttpStatus.BAD_REQUEST)
        }
    }
}
