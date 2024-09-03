import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormsModule } from './forms/forms.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { AuditlogService } from './auditlog/auditlog.service';
import { OtpService } from './otp/otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpModule } from './otp/otp.module';
import { AuditlogModule } from './auditlog/auditlog.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    FormsModule,
    UsersModule,
    StudentModule,
    OtpModule,
    AuditlogModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuditlogService, OtpService],
})
export class AppModule { }
