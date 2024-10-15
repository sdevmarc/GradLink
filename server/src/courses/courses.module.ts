import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesSchema } from './courses.schema';
import { CurriculumSchema } from 'src/curriculum/curriculum.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Course', schema: CoursesSchema },
      { name: 'Curriculum', schema: CurriculumSchema }
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService]
})
export class CoursesModule { }
