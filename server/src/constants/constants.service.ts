import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConstantsService {
    private readonly form_id: string

    constructor(private configService: ConfigService) {
        this.form_id = this.configService.get<string>('FORM_ID');
    }

    getFormId(): string {
        return this.form_id
    }
}
