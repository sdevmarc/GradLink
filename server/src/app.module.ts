import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { AuditlogService } from './auditlog/auditlog.service';
import { OtpService } from './otp/otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpModule } from './otp/otp.module';
import { AuditlogModule } from './auditlog/auditlog.module';
import { JwtModule } from '@nestjs/jwt';
import { ProgramsModule } from './programs/programs.module';
import { CoursesModule } from './courses/courses.module';
import { FormsModule } from './forms/forms.module';

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
        MongooseModule.forRoot(process.env.MONGODB_URI),
        UsersModule,
        StudentModule,
        OtpModule,
        AuditlogModule,
        ProgramsModule,
        CoursesModule,
        FormsModule,
    ],
    controllers: [AppController],
    providers: [AppService, AuditlogService, OtpService],
})
export class AppModule { }
