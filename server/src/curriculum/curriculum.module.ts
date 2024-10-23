import { Module } from '@nestjs/common';
import { CurriculumController } from './curriculum.controller';
import { CurriculumService } from './curriculum.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CurriculumSchema } from './curriculum.schema';
import { CoursesSchema } from 'src/courses/courses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Curriculum', schema: CurriculumSchema },
      { name: 'Course', schema: CoursesSchema },
    ])
  ],
  controllers: [CurriculumController],
  providers: [CurriculumService]
})
export class CurriculumModule { }
