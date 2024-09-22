import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FormSchema } from './forms.schema';
import { ConstantsService } from 'src/constants/constants.service';
import { StudentSchema } from 'src/student/student.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'Form', schema: FormSchema },
        { name: 'Student', schema: StudentSchema },
    ])],
    providers: [
        FormsService,
        ConstantsService
    ],
    controllers: [FormsController]
})
export class FormsModule { }
