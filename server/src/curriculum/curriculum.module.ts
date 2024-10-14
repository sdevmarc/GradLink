import { Module } from '@nestjs/common';
import { CurriculumController } from './curriculum.controller';
import { CurriculumService } from './curriculum.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CurriculumSchema } from './curriculum.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Curriculum', schema: CurriculumSchema }
    ])
  ],
  controllers: [CurriculumController],
  providers: [CurriculumService]
})
export class CurriculumModule { }
