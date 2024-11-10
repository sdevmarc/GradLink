import { Module } from '@nestjs/common';
import { CurriculumController } from './curriculum.controller';
import { CurriculumService } from './curriculum.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CurriculumSchema } from './curriculum.schema';
import { CoursesSchema } from 'src/courses/courses.schema';
import { AuditSchema } from 'src/auditlog/auditlog.schema';
import { AuditlogService } from 'src/auditlog/auditlog.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Curriculum', schema: CurriculumSchema },
      { name: 'Course', schema: CoursesSchema },
      { name: 'Auditlog', schema: AuditSchema },
    ])
  ],
  controllers: [CurriculumController],
  providers: [CurriculumService, AuditlogService]
})
export class CurriculumModule { }
