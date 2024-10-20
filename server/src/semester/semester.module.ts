import { Module } from '@nestjs/common';
import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SemesterSchema } from './semester.schema';
import { StudentSchema } from 'src/student/student.schema';
import { CurriculumSchema } from 'src/curriculum/curriculum.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema },
      { name: 'Semester', schema: SemesterSchema }
    ])
  ],
  controllers: [SemesterController],
  providers: [SemesterService]
})
export class SemesterModule { }
