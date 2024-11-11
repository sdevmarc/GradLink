import { Module } from '@nestjs/common'
import { StudentService } from './student.service'
import { StudentController } from './student.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { StudentSchema } from './student.schema'
import { FormsService } from 'src/forms/forms.service'
import { FormSchema } from 'src/forms/forms.schema'
import { ConstantsService } from 'src/constants/constants.service'
import { CoursesSchema } from 'src/courses/courses.schema'
import { OfferedSchema } from 'src/offered/offered.schema'
import { AuditlogService } from 'src/auditlog/auditlog.service';
import { AuditSchema } from 'src/auditlog/auditlog.schema';
import { CoursesService } from 'src/courses/courses.service'
import { CurriculumSchema } from 'src/curriculum/curriculum.schema'
import { MailSchema } from 'src/mail/mail.schema'
import { MailService } from 'src/mail/mail.service'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema },
      { name: 'Form', schema: FormSchema },
      { name: 'Course', schema: CoursesSchema },
      { name: 'Offered', schema: OfferedSchema },
      { name: 'Auditlog', schema: AuditSchema },
      { name: 'Curriculum', schema: CurriculumSchema },
      { name: 'Mail', schema: MailSchema },
    ])
  ],
  providers: [StudentService, FormsService, ConstantsService, AuditlogService, CoursesService, MailService, CloudinaryService],
  controllers: [StudentController]
})
export class StudentModule { }
