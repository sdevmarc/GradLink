import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IPromiseStudent, IRequestStudent, IStudent } from './student.interface'
import { IModelForm } from 'src/forms/forms.interface'
import { ICourses } from 'src/courses/courses.interface'

@Injectable()
export class StudentService {
    constructor(
        @InjectModel('Student') private readonly studentModel: Model<IStudent>,
        @InjectModel('Form') private readonly formModel: Model<IModelForm>,
        @InjectModel('Course') private readonly courseModel: Model<ICourses>,
    ) { }

    async findAllStudents(): Promise<IPromiseStudent> {
        try {
            const students = await this.studentModel.aggregate([
                {
                    $match: {
                        status: { $in: ['student', 'alumni'] }
                    }
                },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'enrollments.course',
                        foreignField: '_id',
                        as: 'courseDetails'
                    }
                },
                {
                    $addFields: {
                        // Calculate total units enrolled
                        totalOfUnitsEnrolled: {
                            $reduce: {
                                input: '$courseDetails',
                                initialValue: 0,
                                in: { $add: ['$$value', '$$this.units'] }
                            }
                        },
                        // Calculate total units earned (passed courses)
                        totalOfUnitsEarned: {
                            $reduce: {
                                input: {
                                    $filter: {
                                        input: {
                                            $zip: {
                                                inputs: ['$enrollments', '$courseDetails']
                                            }
                                        },
                                        as: 'item',
                                        cond: {
                                            $eq: [{ $arrayElemAt: ['$$item.0.ispass', 0] }, 'pass']
                                        }
                                    }
                                },
                                initialValue: 0,
                                in: {
                                    $add: ['$$value', { $arrayElemAt: ['$$this.1.units', 0] }]
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        // Calculate progress based on units earned vs enrolled
                        progress: {
                            $cond: {
                                if: {
                                    $and: [
                                        // Check if totalOfUnitsEnrolled is greater than 0
                                        { $gt: ['$totalOfUnitsEnrolled', 0] },
                                        // Check if totalOfUnitsEarned equals totalOfUnitsEnrolled
                                        { $eq: ['$totalOfUnitsEarned', '$totalOfUnitsEnrolled'] }
                                    ]
                                },
                                then: 'done',
                                else: 'ongoing'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        idNumber: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        progress: 1,
                        lastname: 1,
                        firstname: 1,
                        middlename: 1,
                        email: 1,
                        totalOfUnitsEnrolled: 1,
                        totalOfUnitsEarned: 1
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ]);

            return { success: true, message: 'Students fetched successfully', data: students }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Enrollees failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findAllEnrollees(): Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.find({ status: 'enrollee' }).sort({ createdAt: -1 })
            return { success: true, message: 'Enrollees fetched successfully', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Enrollees failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findAllCurrentlyEnrolled(): Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.find({ status: 'student', isenrolled: true }).sort({ createdAt: -1 })
            return { success: true, message: 'Current enrolled students fetched successfully', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Enrollees failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findAllAlumni(): Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.find({ status: 'alumni' }).sort({ createdAt: -1 })
            return { success: true, message: 'Alumni(s) fetched successfully', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Enrollees failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // async findAllStudents(): Promise<IPromiseStudent> {
    //     try {
    //         const response = await this.studentModel.aggregate([
    //             {
    //                 $match: { status: 'student' }
    //             },

    //             {
    //                 $unwind: '$enrollments'
    //             },

    //             {
    //                 $sort: { 'enrollments.enrollment_date': -1 }
    //             },
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     idNumber: 1,
    //                     name: 1,
    //                     email: 1,
    //                     progress: '$enrollments.progress',
    //                     enrollment_date: '$enrollments.progress'
    //                 }
    //             }
    //         ])


    //         return { success: true, message: 'Students successfully fetched', data: response }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Students failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    // async findAllStudentsEnrolled(): Promise<IPromiseStudent> {
    //     try {
    //         const response = await this.studentModel.aggregate([
    //             { $match: { isenrolled: true } },
    //             { $unwind: '$enrollments' },
    //             {
    //                 $sort: {
    //                     'enrollments.enrollment_date': -1
    //                 }
    //             },
    //             {
    //                 $group: {
    //                     _id: '$_id',
    //                     idNumber: { $first: '$idNumber' },
    //                     name: { $first: '$name' },
    //                     email: { $first: '$email' },
    //                     progress: { $first: '$enrollments.progress' },
    //                     enrollment_date: { $first: '$enrollments.enrollment_date' }
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'semesters',
    //                     let: { studentId: '$_id' },
    //                     pipeline: [
    //                         {
    //                             $match: {
    //                                 $expr: { $in: ['$$studentId', '$studentsEnrolled'] }
    //                             }
    //                         },
    //                         { $sort: { createdAt: -1 } },
    //                         { $limit: 1 }
    //                     ],
    //                     as: 'semesterInfo'
    //                 }
    //             },
    //             { $unwind: '$semesterInfo' },
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     idNumber: 1,
    //                     name: 1,
    //                     email: 1,
    //                     progress: 1,
    //                     enrollment_date: {
    //                         $dateToString: {
    //                             format: "%m/%d/%Y",
    //                             date: "$enrollment_date"
    //                         }
    //                     },
    //                     semester: '$semesterInfo.semester'
    //                 }
    //             }
    //         ])

    //         return { success: true, message: 'Enrolled students fetched successfully.', data: response }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Error finding enrolled students.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    // async findAllStudentsEnrolled(): Promise<IPromiseStudent> {
    //     try {
    //         const response = await this.studentModel.aggregate([
    //             { $match: { isenrolled: true } },

    //             // Unwind the enrollments array
    //             { $unwind: '$enrollments' },

    //             {
    //                 $sort: {
    //                     'enrollments.semester': -1,
    //                     'enrollments.enrollment_date': -1
    //                 }
    //             },

    //             // Convert enrollment_date to MM/DD/YYYY format
    //             {
    //                 $addFields: {
    //                     formatted_enrollment_date: {
    //                         $dateToString: {
    //                             format: "%m/%d/%Y",
    //                             date: "$enrollments.enrollment_date"
    //                         }
    //                     }
    //                 }
    //             },

    //             // Project to include the formatted date and exclude the original date field
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     idNumber: 1,
    //                     name: 1,
    //                     email: 1,
    //                     semester: '$enrollments.semester',
    //                     progress: '$enrollments.progress',
    //                     enrollment_date: "$formatted_enrollment_date"
    //                 }
    //             }
    //         ])

    //         return { success: true, message: 'Enrolled students fetched successfully.', data: response }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Error finding enrolled students.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    // async findAllAlumni(): Promise<IPromiseStudent> {
    //     try {
    //         const response = await this.studentModel.aggregate([
    //             // Match only enrolled students
    //             {
    //                 $match: {
    //                     isenrolled: false,
    //                     status: 'alumni'
    //                 }
    //             },

    //             // Unwind the enrollments array
    //             { $unwind: '$enrollments' },

    //             // Sort by the most recent enrollment date
    //             { $sort: { 'graduation_date': -1 } },

    //             // Convert enrollment_date to MM/DD/YYYY format
    //             {
    //                 $addFields: {
    //                     formatted_graduation_date: {
    //                         $dateToString: {
    //                             format: "%m/%d/%Y",
    //                             date: "$graduation_date"
    //                         }
    //                     }
    //                 }
    //             },

    //             // Sort the final result by the most recent enrollment date
    //             { $sort: { enrollment_date: -1 } },

    //             // Project to include the formatted date and exclude the original date field
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     idNumber: 1,
    //                     name: 1,
    //                     email: 1,
    //                     graduation_date: "$formatted_graduation_date"
    //                 }
    //             }
    //         ])

    //         return { success: true, message: 'Alumni students fetched successfully.', data: response }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Error finding enrolled students.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    // async findOne(idNumber: IStudent)
    //     : Promise<IPromiseStudent> {
    //     try {
    //         const is_idnumber = await this.studentModel.findOne({ idNumber })
    //         if (!is_idnumber) return { success: false, message: 'Student do not exists.' }

    //         const personal_details = await this.studentModel.aggregate([
    //             { $match: { idNumber, status: 'alumni' } },
    //             {
    //                 $unwind: '$enrollments'
    //             },
    //             { $limit: 1 },
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     idNumber: 1,
    //                     name: 1,
    //                     email: 1,
    //                     generalInformation: 1,
    //                     educationalBackground: 1,
    //                     trainingAdvanceStudies: 1,
    //                     courses: '$enrollments.courses',
    //                     isenrolled: 1,
    //                     status: 1,
    //                     graduation_date: 1
    //                 }
    //             }
    //         ])

    //         return { success: true, message: 'Student fetched successfully', data: personal_details[0] }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Error finding enrolled students.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    async createEnrollee(
        { idNumber, lastname, firstname, middlename, email }: IStudent
    ): Promise<IPromiseStudent> {
        try {
            const isstudent = await this.studentModel.findOne({ idNumber })
            if (isstudent) return { success: false, message: 'ID Number already exists.' }

            const isemail = await this.studentModel.findOne({ email })
            if (isemail) return { success: false, message: 'Email already exists.' }

            await this.studentModel.create({ idNumber, lastname, firstname, middlename, email })
            return { success: true, message: 'Student successfully created.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create student.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async enrollStudent(
        { course, id }: IRequestStudent
    ): Promise<IPromiseStudent> {
        try {
            const iscourse = await this.courseModel.findById(course)
            if (!iscourse) return { success: false, message: 'Course do not exists.' }

            id.map(async (item) => {
                await this.studentModel.findByIdAndUpdate(
                    item,
                    {
                        isenrolled: true,
                        status: 'student',
                        $push: { enrollments: { course } }
                    },

                )
            })

            return { success: true, message: `Students successfully enrolled to the course ${iscourse.descriptiveTitle}` }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create student.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // async unrollAll(): Promise<IPromiseStudent> {
    //     try {
    //         const result = await this.studentModel.updateMany(
    //             { isenrolled: true },
    //             {
    //                 $set: { isenrolled: false },
    //                 $unset: { 'enrollments.$[].progress': '' }
    //             }
    //         )

    //         if (result.modifiedCount > 0) return { success: true, message: `Successfully unenrolled ${result.modifiedCount} students.` }
    //         return { success: true, message: 'No students were enrolled, so none were unenrolled.' }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Failed to unenroll students.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    // async unrollSelection({ _id }: IStudent)
    //     : Promise<IPromiseStudent> {

    //     if (!_id || _id.length === 0) return { success: false, message: 'No students selected for unenrollment.' }
    //     try {
    //         const result = await this.studentModel.updateMany(
    //             {
    //                 _id: { $in: _id },
    //                 isenrolled: true
    //             },
    //             {
    //                 $set: { isenrolled: false }
    //             }
    //         )

    //         // const result = await this.studentModel.updateMany(
    //         //     {
    //         //         _id: { $in: studentIds },
    //         //         isenrolled: true
    //         //     },
    //         //     {
    //         //         $set: { isenrolled: false },
    //         //         $set: { 'enrollments.$[elem].progress': 'dropout' }
    //         //     },
    //         //     {
    //         //         arrayFilters: [{ 'elem.progress': 'ongoing' }]
    //         //     }
    //         // )

    //         if (result.modifiedCount > 0) return { success: true, message: `Successfully unenrolled ${result.modifiedCount} out of ${_id.length} selected students.` }
    //         return { success: true, message: 'No changes were made. Selected students may already be unenrolled.' }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Failed to unenroll selected students.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    // async unrollOne({ _id }: IStudent)
    //     : Promise<IPromiseStudent> {
    //     try {
    //         await this.studentModel.findByIdAndUpdate(
    //             _id,
    //             { isenrolled: false },
    //             { new: true }
    //         )

    //         return { success: true, message: 'Student successfully un-enrolled.' }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Failed to unenroll selected students.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    async insertFormPending({ idNumber }: IModelForm)
        : Promise<IPromiseStudent> {
        try {
            await this.formModel.create({ idNumber })
            return { success: true, message: 'Form pending student created successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create form pending.' }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async formUpdateStudent(
        { idNumber, generalInformation, educationalBackground, trainingAdvanceStudies }: IStudent
    )
        : Promise<IPromiseStudent> {
        try {
            const isstudent = await this.studentModel.findOne({ idNumber })
            if (!isstudent) return { success: false, message: 'Student do not exist.', idNumber }

            await this.studentModel.findOneAndUpdate(
                { idNumber },
                {
                    generalInformation,
                    educationalBackground,
                    trainingAdvanceStudies,
                    status: 'alumni',
                    isenrolled: false,
                    graduation_date: Date.now()
                },
                { new: true }
            )
            return { success: true, message: 'Alumni Graduate updated successfully.', idNumber }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to update student graduate', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
