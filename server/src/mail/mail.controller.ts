import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('send-tracer')
    async sendMailer(@Body() { email }: { email: string[] }) {
        return await this.mailService.sendMail({ email });
    }
}
