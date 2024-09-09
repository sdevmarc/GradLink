import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesSchema } from './courses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Course', schema: CoursesSchema },
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService]
})
export class CoursesModule { }
