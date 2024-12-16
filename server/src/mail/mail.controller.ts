import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('mail')
// @UseGuards(AuthGuard)
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('send-tracer')
    async sendMailer(@Body() { email }: { email: string[] }) {
        return await this.mailService.sendMail({ email });
    }

    @Post('one-alumni')
    async sendToOneAlumni(@Body() { email }: { email: string }) {
        return await this.mailService.sendToOneMail({ email })
    }
}
