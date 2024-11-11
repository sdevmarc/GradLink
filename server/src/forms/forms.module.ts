import { Module } from '@nestjs/common'
import { FormsService } from './forms.service'
import { FormsController } from './forms.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { FormSchema } from './forms.schema'
import { ConstantsService } from 'src/constants/constants.service'
import { StudentSchema } from 'src/student/student.schema'
import { StudentService } from 'src/student/student.service'
import { CoursesSchema } from 'src/courses/courses.schema'
import { ProgramSchema } from 'src/programs/programs.schema'
import { OfferedSchema } from 'src/offered/offered.schema'
import { CurriculumSchema } from 'src/curriculum/curriculum.schema'
import { MailSchema } from 'src/mail/mail.schema'
import { MailService } from 'src/mail/mail.service'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'Form', schema: FormSchema },
        { name: 'Student', schema: StudentSchema },
        { name: 'Course', schema: CoursesSchema },
        { name: 'Program', schema: ProgramSchema },
        { name: 'Offered', schema: OfferedSchema },
        { name: 'Curriculum', schema: CurriculumSchema },
        { name: 'Mail', schema: MailSchema },
    ])],
    providers: [
        FormsService,
        ConstantsService,
        StudentService,
        MailService,
        CloudinaryService
    ],
    controllers: [FormsController]
})
export class FormsModule { }
