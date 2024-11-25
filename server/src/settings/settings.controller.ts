import { Body, Controller, Get, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';

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

}
