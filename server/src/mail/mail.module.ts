import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConstantsService } from 'src/constants/constants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FormSchema } from 'src/forms/forms.schema';
import { MailSchema } from './mail.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Form', schema: FormSchema },
    { name: 'Mail', schema: MailSchema },
  ])],
  providers: [MailService, ConstantsService],
  controllers: [MailController]
})
export class MailModule { }
