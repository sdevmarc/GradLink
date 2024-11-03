import { Module } from '@nestjs/common';
import { OfferedService } from './offered.service';
import { OfferedController } from './offered.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OfferedSchema } from './offered.schema';
import { CoursesSchema } from 'src/courses/courses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Offered', schema: OfferedSchema },
      { name: 'Course', schema: CoursesSchema },
    ])
  ],
  providers: [OfferedService],
  controllers: [OfferedController]
})
export class OfferedModule { }
