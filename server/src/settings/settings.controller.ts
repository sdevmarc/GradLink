import { Body, Controller, Get, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { exec } from 'child_process';

@Controller('settings')
export class SettingsController {
    constructor(
        private readonly settingsService: SettingsService
    ) { }

    @Get()
    async findAllSystemSettings() {
        return await this.settingsService.findAll()
    }

    @Post('update-settings')
    async updateSystemSettings(@Body() { isenroll }) {
        return await this.settingsService.upsertSettings({ isenroll })
    }

    @Post('restore')
    async restoreDatabase(): Promise<{ success: boolean, message: string }> {
        return new Promise((resolve, reject) => {
            exec('/usr/local/bin/restore.sh', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error object: ${error}`);
                    console.error(`Restore stderr: ${stderr}`);
                    return reject({ success: false, message: 'Restore Failed', error });
                }
                console.log(stdout);
                resolve({ success: true, message: 'Restore Successful.' });
            });
        });
    }
}
