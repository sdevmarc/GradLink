import { Module } from '@nestjs/common'
import { StudentService } from './student.service'
import { StudentController } from './student.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { StudentSchema } from './student.schema'
import { FormsService } from 'src/forms/forms.service'
import { FormSchema } from 'src/forms/forms.schema'
import { ConstantsService } from 'src/constants/constants.service'
import { CurriculumSchema } from 'src/curriculum/curriculum.schema'
import { CurriculumService } from 'src/curriculum/curriculum.service'
import { CoursesSchema } from 'src/courses/courses.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema },
      { name: 'Form', schema: FormSchema },
      { name: 'Curriculum', schema: CurriculumSchema },
      { name: 'Course', schema: CoursesSchema },
    ])
  ],
  providers: [StudentService, FormsService, ConstantsService, CurriculumService],
  controllers: [StudentController]
})
export class StudentModule { }
