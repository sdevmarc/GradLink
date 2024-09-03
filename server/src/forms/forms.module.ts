import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FormsSchema } from './forms.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Form', schema: FormsSchema },
        ]),
    ],
    providers: [
        FormsService
    ],
    controllers: [FormsController]
})
export class FormsModule { }
