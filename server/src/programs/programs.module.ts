import { Module } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { ProgramsController } from './programs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgramSchema } from './programs.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Program', schema: ProgramSchema }
  ])],
  providers: [ProgramsService],
  controllers: [ProgramsController]
})
export class ProgramsModule { }
