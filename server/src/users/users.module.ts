import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from './users.schema';
import { MailService } from 'src/mail/mail.service';
import { MailSchema } from 'src/mail/mail.schema';
import { ConstantsService } from 'src/constants/constants.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'User', schema: UsersSchema },
            { name: 'Mail', schema: MailSchema },
        ]),
    ],
    providers: [UsersService, MailService, ConstantsService],
    controllers: [UsersController]
})
export class UsersModule { }
