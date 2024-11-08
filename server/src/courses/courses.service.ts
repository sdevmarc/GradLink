import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
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
            const courses = await this.CurriculumModel.aggregate([
                // Unwind the categories array
                { $unwind: "$categories" },

                // Unwind the courses array within categories
                { $unwind: "$categories.courses" },

                // Lookup to get course details
                {
                    $lookup: {
                        from: "courses",
                        localField: "categories.courses",
                        foreignField: "_id",
                        as: "courseDetails"
                    }
                },

                // Unwind the courseDetails array
                { $unwind: "$courseDetails" },

                // Lookup to get program details
                {
                    $lookup: {
                        from: "programs",
                        localField: "programid",
                        foreignField: "_id",
                        as: "programDetails"
                    }
                },

                // Unwind the programDetails array
                { $unwind: "$programDetails" },

                // Group by course to eliminate duplicates and shape the output
                {
                    $group: {
                        _id: "$courseDetails._id",
                        code: { $first: "$courseDetails.code" },
                        courseno: { $first: "$courseDetails.courseno" },
                        descriptiveTitle: { $first: "$courseDetails.descriptiveTitle" },
                        program: { $first: "$programDetails._id" },
                        units: { $first: "$courseDetails.units" },
                        // program: {
                        //     $first: {
                        //         code: "$programDetails._id",
                        //         descriptiveTitle: "$programDetails.descriptiveTitle"
                        //     }
                        // },
                        department: { $first: "$programDetails.department" },
                        createdAt: { $first: "$courseDetails.createdAt" },
                        updatedAt: { $first: "$courseDetails.updatedAt" }
                    }
                },

                // Sort by _id in descending order
                { $sort: { code: 1 } }
            ]);

            return {
                success: true,
                message: 'Courses fetched successfully',
                data: courses
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to fetch all courses.',
                    error
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findAllCoursesForAdditional({ curriculumid }: ICourses): Promise<IPromiseCourse> {
        try {
            const curriculum = await this.CurriculumModel.findById(curriculumid);

            if (!curriculum) {
                throw new HttpException(
                    { success: false, message: 'Curriculum not found' },
                    HttpStatus.NOT_FOUND
                )
            }

            // Extract all course IDs from all categories
            const curriculumCourseIds = curriculum.categories.reduce((acc, category) => {
                return [...acc, ...category.courses.map(id => new mongoose.Types.ObjectId(id))];
            }, [])

            // Now find all courses that are not in the curriculum
            const response = await this.CourseModel.find({
                _id: { $nin: curriculumCourseIds }
            }).sort({ _id: -1 })

            return { success: true, message: 'Courses fetched successfully', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to fetch all program.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findAllCoursesInActiveCurricullum(): Promise<IPromiseCourse> {
        try {
            const activeCurriculum = await this.CurriculumModel.findOne({ isActive: true })

            if (!activeCurriculum) return { success: false, message: 'No active curriculum found', data: [] }

            // Extract all course IDs from all categories
            const courseIds = activeCurriculum.categories.reduce((acc, category) => {
                return [...acc, ...category.courses]
            }, [])

            // Remove duplicates if any
            const uniqueCourseIds = [...new Set(courseIds)]

            // Fetch all courses that match these IDs
            const courses = await this.CourseModel.find({
                _id: { $in: uniqueCourseIds }
            })

            // const courses = await this.CourseModel.find({
            //     _id: { $in: uniqueCourseIds }
            // }).populate('prerequisites')

            return { success: true, message: 'Courses from active curriculum fetched successfully', data: courses }

        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to fetch courses from active curriculum', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async create({ code, courseno, descriptiveTitle, units }: ICourses)
        : Promise<IPromiseCourse> {
        try {
            // Validate and convert code to number
            const numericCode = Number(code)
            const numericUnits = Number(units)
            if (isNaN(numericCode)) return { success: false, message: 'Course code must be a valid number.' }


            // Normalize inputs
            const normalizedCourseNo = courseno.trim().toUpperCase()
            const normalizedTitle = descriptiveTitle.trim()

            // Validate code existence
            const existingCode = await this.CourseModel.findOne({ code: numericCode })

            if (existingCode) return { success: false, message: 'Course code already exists.' }

            // Validate course number
            const existingCourseNo = await this.CourseModel.findOne({
                courseno: {
                    $regex: `^${normalizedCourseNo.replace(/\s+/g, '\\s*')}$`,
                    $options: 'i'
                }
            })

            if (existingCourseNo) return { success: false, message: 'Course number already exists.' }

            // Validate descriptive title for duplicates
            const existingTitle = await this.CourseModel.findOne({
                descriptiveTitle: {
                    $regex: `^${normalizedTitle.replace(/\s+/g, '\\s*')}$`,
                    $options: 'i'
                }
            })

            if (existingTitle) return { success: false, message: 'Course descriptive title already exists.' }

            // Validate units
            if (typeof numericUnits !== 'number' || numericUnits <= 0) return { success: false, message: 'Units must be a positive number.' }

            // Create new course with numeric code
            await this.CourseModel.create({
                code: numericCode,
                courseno: normalizedCourseNo,
                descriptiveTitle: normalizedTitle,
                units: numericUnits,
            })

            return { success: true, message: 'Course successfully created.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create course.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // async updateToCourseOffered({ id }: IRequestCourses)
    //     : Promise<IPromiseCourse> {
    //     try {
    //         await this.CourseModel.updateMany({ isoffered: true }, { isoffered: false })
    //         const coursesOffered = await Promise.all(id.map(async (item) => {
    //             const newCourses = await this.CourseModel.findByIdAndUpdate(item, { isoffered: true }, { new: true })
    //             return { success: true, message: `Course successfully added in the courses offered.`, data: newCourses }
    //         }))
    //         return { success: true, message: 'Courses offered updated successfully.', data: coursesOffered }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Failed to create new curriculum.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }
}
