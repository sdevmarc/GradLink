import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema } from 'src/student/student.schema';
import { StudentService } from 'src/student/student.service';
import { FormSchema } from './forms.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'Student', schema: StudentSchema },
        { name: 'Form', schema: FormSchema },
    ])],
    providers: [
        FormsService,
        StudentService
    ],
    controllers: [FormsController]
})
export class FormsModule { }
