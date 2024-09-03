import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormsModule } from './forms/forms.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './constants';
import { StudentModule } from './student/student.module';
import { AuditlogService } from './auditlog/auditlog.service';
import { OtpService } from './otp/otp.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig]
    }),
    FormsModule,
    UsersModule,
    StudentModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuditlogService, OtpService],
})
export class AppModule { }
