import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConstantsService } from 'src/constants/constants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MailSchema } from './mail.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Mail', schema: MailSchema },
  ])],
  providers: [MailService, ConstantsService],
  controllers: [MailController]
})
export class MailModule { }
