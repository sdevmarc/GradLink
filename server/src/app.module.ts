import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { StudentModule } from './student/student.module'
import { AuditlogService } from './auditlog/auditlog.service'
import { OtpService } from './otp/otp.service'
import { MongooseModule } from '@nestjs/mongoose'
import { OtpModule } from './otp/otp.module'
import { AuditlogModule } from './auditlog/auditlog.module'
import { JwtModule } from '@nestjs/jwt'
import { ProgramsModule } from './programs/programs.module'
import { CoursesModule } from './courses/courses.module'
import { FormsModule } from './forms/forms.module'
import { ConstantsService } from './constants/constants.service'
import { MailModule } from './mail/mail.module'
import { MailerModule } from '@nestjs-modules/mailer'
import { CurriculumModule } from './curriculum/curriculum.module'
import { OfferedModule } from './offered/offered.module';
import { SettingsModule } from './settings/settings.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, }),
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '10s' },
            }),
        }),
        MailerModule.forRoot({
            transport: {
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
                defaults: {
                    from: '"SMU Graduate Alumni Tracer" <yourparengedison@gmail.com>',
                }
            },
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI),
        UsersModule,
        StudentModule,
        OtpModule,
        AuditlogModule,
        CoursesModule,
        FormsModule,
        MailModule,
        CurriculumModule,
        ProgramsModule,
        OfferedModule,
        SettingsModule,
    ],
    controllers: [AppController],
    providers: [AppService, AuditlogService, OtpService, ConstantsService],
})
export class AppModule { }
