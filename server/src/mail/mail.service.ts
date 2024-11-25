import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMail, IPromiseMail } from './mail.interface';
import { ConstantsService } from 'src/constants/constants.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class MailService {
    constructor(
        @InjectModel('Mail') private readonly mailModel: Model<IMail>,
        private readonly mailService: MailerService,
        private readonly constantsService: ConstantsService

    ) { }

    async sendMail({ email }: { email: string[] }): Promise<IPromiseMail> {
        try {
            const google_form = `https://docs.google.com/forms/d/${this.constantsService.getFormId()}`
            const message = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saint Mary's University Alumni Survey</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #003366, #0066cc);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #003366;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.8em;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Saint Mary's University Alumni Survey</h1>
    </div>
    <div class="content">
        <p>Dear Alumni Graduate,</p>
        <p>We hope this email finds you well and thriving in your post-graduate endeavors. As a valued member of our alumni community, your experiences and insights are invaluable to us.</p>
        <p>We are conducting a brief survey to better understand how your graduate studies at Saint Mary's University have influenced your career and personal growth. Your feedback will help us enhance our programs for future students and strengthen our alumni network.</p>
        <p>The survey will only take about 5 minutes of your time, and your responses will be kept strictly confidential.</p>
        <p>As a token of our appreciation, all participants will be entered into a draw to win exclusive Saint Mary's University merchandise!</p>
        <a href="${google_form}" class="button">Take the Alumni Survey</a>
        <p><strong>Your participation matters:</strong> Your input will directly contribute to the continuous improvement of our graduate programs and alumni services.</p>
    </div>
    <div class="footer">
        <p>This email is intended for Saint Mary's University Graduate Alumni. If you received this by mistake, please disregard this message.</p>
        <p>© ${new Date().getFullYear()} Saint Mary's University. All rights reserved.</p>
    </div>
</body>
</html>
            `;

            const responses = await Promise.all(email.map(async (recipient) =>
                await this.mailService.sendMail({
                    to: recipient,
                    subject: `Can I take a minute of your time? 😞`,
                    html: message
                })
            ));

            return { success: true, message: 'Email sent successfully!', data: responses }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Email failed to send.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    async sendToOneMail({ email }: { email: string }): Promise<IPromiseMail> {
        try {
            const google_form = `https://docs.google.com/forms/d/${this.constantsService.getFormId()}`
            const message = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saint Mary's University Alumni Survey</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #003366, #0066cc);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #003366;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.8em;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Saint Mary's University Alumni Survey</h1>
    </div>
    <div class="content">
        <p>Dear Alumni Graduate,</p>
        <p>We hope this email finds you well and thriving in your post-graduate endeavors. As a valued member of our alumni community, your experiences and insights are invaluable to us.</p>
        <p>We are conducting a brief survey to better understand how your graduate studies at Saint Mary's University have influenced your career and personal growth. Your feedback will help us enhance our programs for future students and strengthen our alumni network.</p>
        <p>The survey will only take about 5 minutes of your time, and your responses will be kept strictly confidential.</p>
        <p>As a token of our appreciation, all participants will be entered into a draw to win exclusive Saint Mary's University merchandise!</p>
        <a href="${google_form}" class="button">Take the Alumni Survey</a>
        <p><strong>Your participation matters:</strong> Your input will directly contribute to the continuous improvement of our graduate programs and alumni services.</p>
    </div>
    <div class="footer">
        <p>This email is intended for Saint Mary's University Graduate Alumni. If you received this by mistake, please disregard this message.</p>
        <p>© ${new Date().getFullYear()} Saint Mary's University. All rights reserved.</p>
    </div>
</body>
</html>
            `;

            const response = await this.mailService.sendMail({
                to: email,
                subject: `Your SMU Story Continues—Join Our Tracer Study Today! ✨📝`,
                html: message
            })

            await this.mailModel.create({
                email,
                date_sent: new Date(),
                notes: `Tracer survey sent successfully.`
            })

            return { success: true, message: 'Email sent successfully!', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Email failed to send.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Ensures a 6-digit number
    }

    async sendOtpMail({ email }: { email: string }): Promise<IPromiseMail> {
        try {
            const otp_code = this.generateOtp()
            const message = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your One-Time Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f9;
        }
        .header {
            background: linear-gradient(135deg, #4a90e2, #0078d7);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .otp-box {
            font-size: 24px;
            font-weight: bold;
            background-color: #f4f4f9;
            border: 2px dashed #0078d7;
            padding: 10px;
            margin: 20px 0;
            text-align: center;
            color: #0078d7;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.8em;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Your One-Time Password</h1>
    </div>
    <div class="content">
        <p>Hello,</p>
        <p>Here is your one-time password (OTP). Please use it to complete your verification process. For security reasons, do not share this OTP with anyone.</p>
        <div class="otp-box">${otp_code}</div>
        <p><strong>Note:</strong> This OTP is valid for 5 minutes only.</p>
        <p>If you did not request this OTP, please ignore this email or contact support immediately.</p>
    </div>
    <div class="footer">
        <p>© ${new Date().getFullYear()} Saint Mary's University. All rights reserved.</p>
    </div>
</body>
</html>
            `;

            await this.mailService.sendMail({
                to: email,
                subject: `Gradlink: One-Time-Password!`,
                html: message
            })

            await this.mailModel.create({
                email,
                date_sent: new Date(),
                notes: `One-time-password sent successfully to ${email}.`
            })

            const salt = await bcrypt.genSalt();
            const hashedOtp = await bcrypt.hash(otp_code, salt);

            return { success: true, message: 'Email sent successfully!', data: hashedOtp }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Email failed to send.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
