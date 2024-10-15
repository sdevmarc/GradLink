import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ICourses, IPromiseCourse } from './courses.interface'
import { ICurriculum } from 'src/curriculum/curriculum.interface'

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel('Course') private readonly CourseModel: Model<ICourses>,
        @InjectModel('Curriculum') private readonly CurriculumModel: Model<ICurriculum>
    ) { }

    async findAllInActive(): Promise<IPromiseCourse> {
        try {
            const response = await this.CurriculumModel.aggregate([
                { $match: { isActive: true } },

                // Lookup programs for this curriculum
                {
                    $lookup: {
                        from: 'programs',
                        localField: '_id',
                        foreignField: 'curriculumId',
                        as: 'programs'
                    }
                },

                // Unwind the programs array
                { $unwind: '$programs' },

                // Lookup courses for each program
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'programs._id',
                        foreignField: 'programs',
                        as: 'courses'
                    }
                },

                // Group everything back together
                {
                    $group: {
                        _id: '$_id',
                        name: { $first: '$name' },
                        programs: { $push: '$programs' },
                        courses: { $push: '$courses' }
                    }
                },

                // Flatten the courses array
                {
                    $project: {
                        name: 1,
                        programs: 1,
                        courses: {
                            $reduce: {
                                input: '$courses',
                                initialValue: [],
                                in: { $setUnion: ['$$value', '$$this'] }
                            }
                        }
                    }
                }
            ])

            return { success: true, message: 'Programs for the current curriculum fetched successfully.', data: response[0] }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to fetch all program.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findOne({ courseno }: ICourses)
        : Promise<IPromiseCourse> {
        try {
            const response = await this.CourseModel.findOne({ courseno })
            return { success: true, message: 'Course fetched successfully', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Course failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async create({ courseno, descriptiveTitle, programs, units, prerequisites }: ICourses)
        : Promise<IPromiseCourse> {
        try {
            const iscourse = await this.CourseModel.findOne({ courseno })
            if (iscourse) return { success: false, message: 'Course already exist.' }

            await this.CourseModel.create({ courseno, descriptiveTitle, programs, units, prerequisites })
            return { success: true, message: 'Course successfully created.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create course.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findByIdAndUpdate({ cid, courseno, descriptiveTitle, programs, units }: ICourses)
        : Promise<IPromiseCourse> {
        try {
            await this.CourseModel.findByIdAndUpdate(
                cid,
                { courseno, descriptiveTitle, programs, units },
                { new: true }
            )

            return { success: true, message: 'Course updated successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Course failed to update.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async delete({ cid }: ICourses)
        : Promise<IPromiseCourse> {
        try {
            await this.CourseModel.findByIdAndDelete(cid)
            return { success: true, message: 'Course deleted successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Course failed to delete.' }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
