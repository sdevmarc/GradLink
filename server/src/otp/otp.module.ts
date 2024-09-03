import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpSchema } from './otp.schema';
import { OtpService } from './otp.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Otp', schema: OtpSchema },
        ]),
    ],
    providers: [OtpService],
})

export class OtpModule { }
