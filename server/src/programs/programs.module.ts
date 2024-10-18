import { Module } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { ProgramsController } from './programs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgramSchema } from './programs.schema';
import { CurriculumSchema } from 'src/curriculum/curriculum.schema';
import { CurriculumService } from 'src/curriculum/curriculum.service';
import { CoursesSchema } from 'src/courses/courses.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Course', schema: CoursesSchema },
    { name: 'Program', schema: ProgramSchema },
    { name: 'Curriculum', schema: CurriculumSchema }
  ])],
  providers: [ProgramsService, CurriculumService],
  controllers: [ProgramsController]
})
export class ProgramsModule { }
