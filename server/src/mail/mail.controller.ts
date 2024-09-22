import { Controller, Get, Param } from '@nestjs/common';
import { MailService } from './mail.service';
import { IMail } from './mail.interface';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Get(':email')
    async sendMailer(@Param('email') send_to: IMail) {
        return await this.mailService.sendMail(send_to);
    }
}
