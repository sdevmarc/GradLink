import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConstantsService } from 'src/constants/constants.service';

@Module({
  providers: [MailService, ConstantsService],
  controllers: [MailController]
})
export class MailModule { }
