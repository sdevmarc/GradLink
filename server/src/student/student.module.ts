import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema } from './student.schema';
import { FormsService } from 'src/forms/forms.service';
import { FormSchema } from 'src/forms/forms.schema';
import { ConstantsService } from 'src/constants/constants.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema },
      { name: 'Form', schema: FormSchema }
    ])
  ],
  providers: [StudentService, FormsService, ConstantsService],
  controllers: [StudentController]
})
export class StudentModule { }
