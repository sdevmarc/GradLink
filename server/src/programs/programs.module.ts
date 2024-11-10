import { Module } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { ProgramsController } from './programs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgramSchema } from './programs.schema';
import { CurriculumSchema } from 'src/curriculum/curriculum.schema';
import { CurriculumService } from 'src/curriculum/curriculum.service';
import { CoursesSchema } from 'src/courses/courses.schema';
import { AuditlogService } from 'src/auditlog/auditlog.service';
import { AuditSchema } from 'src/auditlog/auditlog.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Course', schema: CoursesSchema },
    { name: 'Program', schema: ProgramSchema },
    { name: 'Curriculum', schema: CurriculumSchema },
    { name: 'Auditlog', schema: AuditSchema },
  ])],
  providers: [ProgramsService, CurriculumService, AuditlogService],
  controllers: [ProgramsController]
})
export class ProgramsModule { }
