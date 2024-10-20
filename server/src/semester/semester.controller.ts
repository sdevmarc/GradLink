import { Controller, Get } from '@nestjs/common';
import { SemesterService } from './semester.service';

@Controller('semester')
export class SemesterController {
    constructor(
        private readonly semesterService: SemesterService
    ) { }

    @Get('check-semester')
    async isSemesterExists() {
        return await this.semesterService.isSemesterExists()
    }
}
