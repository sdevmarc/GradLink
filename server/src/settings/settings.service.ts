import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPromiseSettings, ISettings } from './settings.interface';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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

    async restoreDatabase(): Promise<IPromiseSettings> {
        try {
            // Define the command to run the restore.sh script
            const command = 'docker exec -it server-nestjs-1 sh restore.sh';

            // Execute the command using execAsync (promisified version of exec)
            const { stdout, stderr } = await execAsync(command);

            console.log(stdout)

            return { success: true, message: 'Database restored successfully!' }

            //   // Log standard output and errors (if any)
            //   if (stdout) {
            //     this.logger.log(`Restore Output: ${stdout}`);
            //   }

            //   if (stderr) {
            //     this.logger.warn(`Restore Errors/Warnings: ${stderr}`);
            //   }

            //   this.logger.log('Database restore completed successfully');
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to restore database.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
