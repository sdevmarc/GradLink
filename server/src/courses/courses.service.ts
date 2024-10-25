import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ICourses, IPromiseCourse, IRequestCourses } from './courses.interface'
import { ICurriculum } from 'src/curriculum/curriculum.interface'

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel('Course') private readonly CourseModel: Model<ICourses>,
        @InjectModel('Curriculum') private readonly CurriculumModel: Model<ICurriculum>
    ) { }

    async findAll(): Promise<IPromiseCourse> {
        try {
            const response = await this.CourseModel.find()

            return { success: true, message: 'Courses fetched successfully', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to fetch all program.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findAllCoursesOffered(): Promise<IPromiseCourse> {
        try {
            const response = await this.CourseModel.find({ isoffered: true }).sort({ _id: -1 })

            return { success: true, message: 'Courses fetched successfully', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to fetch all program.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findAllCoursesInActiveCurricullum(): Promise<IPromiseCourse> {
        try {
            const activeCurriculum = await this.CurriculumModel.findOne({ isActive: true });

            // if (!activeCurriculum) return { success: false, message: 'No active curriculum found', data: [] }

            // Extract all course IDs from all categories
            const courseIds = activeCurriculum.categories.reduce((acc, category) => {
                return [...acc, ...category.courses];
            }, []);

            // Remove duplicates if any
            const uniqueCourseIds = [...new Set(courseIds)];

            // Fetch all courses that match these IDs
            const courses = await this.CourseModel.find({
                _id: { $in: uniqueCourseIds }
            }).populate('prerequisites')

            return { success: true, message: 'Courses from active curriculum fetched successfully', data: courses };

        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to fetch courses from active curriculum',
                    error
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // async findAllStudentsEnrolled(): Promise<IPromiseCourse> {
    //     try {
    //         const response = await this.CourseModel.aggregate([
    //             {}
    //         ])
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Students enrolled in course failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    // async findOne({ courseno }: ICourses)
    //     : Promise<IPromiseCourse> {
    //     try {
    //         const response = await this.CourseModel.findOne({ courseno })
    //         return { success: true, message: 'Course fetched successfully', data: response }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Course failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    async create({ code, courseno, descriptiveTitle, units, prerequisites }: ICourses)
        : Promise<IPromiseCourse> {
        try {
            const iscode = await this.CourseModel.findOne({ code })
            if (iscode) return { success: false, message: 'Code already exist.' }

            const iscourseno = await this.CourseModel.findOne({ courseno })
            if (iscourseno) return { success: false, message: 'Course number already exist.' }

            await this.CourseModel.create({ code, courseno, descriptiveTitle, units, prerequisites })
            return { success: true, message: 'Course successfully created.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create course.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateToCourseOffered({ id }: IRequestCourses)
        : Promise<IPromiseCourse> {
        try {
            await this.CourseModel.updateMany({ isoffered: true }, { isoffered: false })
            const coursesOffered = await Promise.all(id.map(async (item) => {
                const newCourses = await this.CourseModel.findByIdAndUpdate(item, { isoffered: true }, { new: true })
                return { success: true, message: `Course successfully added in the courses offered.`, data: newCourses }
            }))
            return { success: true, message: 'Courses offered updated successfully.', data: coursesOffered }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create new curriculum.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // async findByIdAndUpdate({ cid, courseno, descriptiveTitle, programs, units }: ICourses)
    //     : Promise<IPromiseCourse> {
    //     try {
    //         await this.CourseModel.findByIdAndUpdate(
    //             cid,
    //             { courseno, descriptiveTitle, programs, units },
    //             { new: true }
    //         )

    //         return { success: true, message: 'Course updated successfully.' }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Course failed to update.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    // async delete({ cid }: ICourses)
    //     : Promise<IPromiseCourse> {
    //     try {
    //         await this.CourseModel.findByIdAndDelete(cid)
    //         return { success: true, message: 'Course deleted successfully.' }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Course failed to delete.' }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }
}
