import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema } from './student.schema';
import { FormsService } from 'src/forms/forms.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema },
    ])
  ],
  providers: [StudentService, FormsService],
  controllers: [StudentController]
})
export class StudentModule { }
