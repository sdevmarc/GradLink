import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FormSchema } from './forms.schema';
import { ConstantsService } from 'src/constants/constants.service';
import { StudentSchema } from 'src/student/student.schema';
import { StudentService } from 'src/student/student.service';
import { SemesterService } from 'src/semester/semester.service';
import { CurriculumSchema } from 'src/curriculum/curriculum.schema';
import { SemesterSchema } from 'src/semester/semester.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'Form', schema: FormSchema },
        { name: 'Student', schema: StudentSchema },
        { name: 'Semester', schema: SemesterSchema },
    ])],
    providers: [
        FormsService,
        ConstantsService,
        StudentService
    ],
    controllers: [FormsController]
})
export class FormsModule { }
