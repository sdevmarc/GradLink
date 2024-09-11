import { Module } from '@nestjs/common';
import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SemesterSchema } from './semester.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Semester', schema: SemesterSchema }
    ])
  ],
  controllers: [SemesterController],
  providers: [SemesterService]
})
export class SemesterModule { }
