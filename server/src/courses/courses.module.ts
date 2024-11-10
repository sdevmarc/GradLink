import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesSchema } from './courses.schema';
import { CurriculumSchema } from 'src/curriculum/curriculum.schema';
import { AuditlogService } from 'src/auditlog/auditlog.service';
import { AuditSchema } from 'src/auditlog/auditlog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Course', schema: CoursesSchema },
      { name: 'Curriculum', schema: CurriculumSchema },
      { name: 'Auditlog', schema: AuditSchema },
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService, AuditlogService]
})
export class CoursesModule { }
