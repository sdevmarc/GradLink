import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPromiseSettings, ISettings } from './settings.interface';

@Injectable()
export class SettingsService {
    constructor(
        @InjectModel('Settings') private readonly SettingsModel: Model<ISettings>
    ) { }

    async findAll(): Promise<IPromiseSettings> {
        try {
            const response = await this.SettingsModel.findOne({ index: 1 })

            if (!response) {
                await this.SettingsModel.findOneAndUpdate({ index: 1 }, { isenroll: true }, { new: true, upsert: true })

                const issettings = await this.SettingsModel.findOne({ index: 1 })
                return { success: true, message: 'Settings fetched successfully.', data: issettings }
            }
            return { success: true, message: 'Settings fetched successfully.', data: response }
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch settings.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async upsertSettings({ isenroll }: ISettings): Promise<IPromiseSettings> {
        try {
            await this.SettingsModel.findOneAndUpdate(
                { index: 1 },
                { isenroll },
                { new: true, upsert: true }
            )
            return { success: true, message: 'Settings updated successfully.' }
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to update settings.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
