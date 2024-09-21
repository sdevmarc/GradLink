import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConstantsService {
    private readonly form_id: string
    private readonly mail_username: string
    private readonly mail_password: string
    private readonly mail_host: string

    constructor(private configService: ConfigService) {
        this.form_id = this.configService.get<string>('FORM_ID')
        this.mail_username = this.configService.get<string>('EMAIL_USERNAME')
        this.mail_password = this.configService.get<string>('EMAIL_PASSWORD')
        this.mail_host = this.configService.get<string>('EMAIL_HOST');
    }

    getFormId(): string {
        return this.form_id
    }

    getMailUsername(): string {
        return this.mail_username
    }

    getMailPassword(): string {
        return this.mail_password
    }

    getMailHost(): string {
        return this.mail_host
    }
}
