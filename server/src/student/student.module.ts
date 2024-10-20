import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema } from './student.schema';
import { FormsService } from 'src/forms/forms.service';
import { FormSchema } from 'src/forms/forms.schema';
import { ConstantsService } from 'src/constants/constants.service';
import { SemesterSchema } from 'src/semester/semester.schema';
import { SemesterService } from 'src/semester/semester.service';
import { CurriculumSchema } from 'src/curriculum/curriculum.schema';
import { CurriculumService } from 'src/curriculum/curriculum.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema },
      { name: 'Form', schema: FormSchema },
      { name: 'Semester', schema: SemesterSchema },
      { name: 'Curriculum', schema: CurriculumSchema }
    ])
  ],
  providers: [StudentService, FormsService, ConstantsService, SemesterService, CurriculumService],
  controllers: [StudentController]
})
export class StudentModule { }
