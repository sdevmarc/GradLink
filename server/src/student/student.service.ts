import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IPromiseStudent, IStudent, IStudentFormPending } from './student.interface'

@Injectable()
export class StudentService {
    constructor(
        @InjectModel('Student') private readonly studentModel: Model<IStudent>,
        @InjectModel('Form') private readonly formModel: Model<IStudentFormPending>
    ) { }

    //UNFIXED
    async findAll(): Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.find()
            const mappedResponse = response.map((item) => {
                const { idNumber, name, email, enrollments } = item

                //FIXED TO DATE TYPE
                const sortedEnrollments = enrollments.sort((a, b) => {
                    if (b.enrollment_date !== a.enrollment_date) {
                        return parseInt(b.enrollment_date) - parseInt(a.enrollment_date)
                    }
                    return parseInt(b.semester) - parseInt(a.semester)
                })

                // Sort enrollments from latest to oldest
                // const sortedEnrollments = enrollments.sort((a, b) => {
                //     if (b.year !== a.year) {
                //         return parseInt(b.year) - parseInt(a.year)
                //     }
                //     return parseInt(b.semester) - parseInt(a.semester)
                // })

                const mostRecentEnrollment = sortedEnrollments[0]

                return {
                    idNumber,
                    name,
                    email,
                    progress: mostRecentEnrollment ? mostRecentEnrollment.progress : null,
                    //FIX TO DATE TYPE
                    enrollment_date: mostRecentEnrollment ? mostRecentEnrollment.enrollment_date : null,
                    // year: mostRecentEnrollment ? mostRecentEnrollment.year : null,
                    mostRecentEnrollment // This will be used for sorting and then removed
                }
            })

            // Sort students based on their most recent enrollment
            const sortedStudents = mappedResponse.sort((a, b) => {
                const aRecent = a.mostRecentEnrollment
                const bRecent = b.mostRecentEnrollment

                if (!aRecent) return 1  // a should come after b if a has no enrollments
                if (!bRecent) return -1 // b should come after a if b has no enrollments

                //FIX TO DATE TYPE
                if (bRecent.enrollment_date !== aRecent.enrollment_date) {
                    return parseInt(bRecent.enrollment_date) - parseInt(aRecent.enrollment_date)
                }

                // if (bRecent.year !== aRecent.year) {
                //     return parseInt(bRecent.year) - parseInt(aRecent.year)
                // }
                return parseInt(bRecent.semester) - parseInt(aRecent.semester)
            })

            // Remove the mostRecentEnrollment field from the final output
            const finalResponse = sortedStudents.map(({ mostRecentEnrollment, ...rest }) => rest)

            return { success: true, message: 'Students successfully fetched', data: finalResponse }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Students failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findAllStudentsEnrolled()
        : Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.aggregate([
                // Match only enrolled students
                { $match: { isenrolled: true } },

                // Unwind the enrollments array
                { $unwind: '$enrollments' },

                // Sort by the most recent enrollment date
                { $sort: { 'enrollments.enrollment_date': -1 } },

                // Group back to get the most recent enrollment for each student
                {
                    $group: {
                        _id: '$_id',
                        idNumber: { $first: '$idNumber' },
                        name: { $first: '$name' },
                        email: { $first: '$email' },
                        // generalInformation: { $first: '$generalInformation' },
                        // educationalBackground: { $first: '$educationalBackground' },
                        // trainingAdvanceStudies: { $first: '$trainingAdvanceStudies' },
                        enrollments: { $first: '$enrollments' },
                        // isenrolled: { $first: '$isenrolled' },
                        // status: { $first: '$status' },
                        // graduation_date: { $first: '$graduation_date' },
                        // createdAt: { $first: '$createdAt' },
                        // updatedAt: { $first: '$updatedAt' }
                    }
                },

                // Sort the final result by the most recent enrollment date
                { $sort: { 'mostRecentEnrollment.enrollment_date': -1 } }
            ])

            return { success: true, message: 'Enrolled students fetched successfully.', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Error finding enrolled students.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async create(
        { idNumber, name, email, enrollments, isenrolled }: IStudent
    ): Promise<IPromiseStudent> {
        try {
            const isstudent = await this.studentModel.findOne({ idNumber })
            if (isstudent) return { success: false, message: 'Student already exists.' }

            await this.studentModel.create({ idNumber, name, email, enrollments, isenrolled })
            return { success: true, message: 'Student successfully created.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create student.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async unrollAll(): Promise<IPromiseStudent> {
        try {
            const result = await this.studentModel.updateMany(
                { isenrolled: true },
                {
                    $set: { isenrolled: false },
                    $unset: { 'enrollments.$[].progress': '' }
                }
            );

            if (result.modifiedCount > 0) return { success: true, message: `Successfully unenrolled ${result.modifiedCount} students.` }
            return { success: true, message: 'No students were enrolled, so none were unenrolled.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to unenroll students.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async unrollSelection({ sid }: IStudent)
        : Promise<IPromiseStudent> {

        if (!sid || sid.length === 0) return { success: false, message: 'No students selected for unenrollment.' }
        try {
            const result = await this.studentModel.updateMany(
                {
                    _id: { $in: sid },
                    isenrolled: true
                },
                {
                    $set: { isenrolled: false }
                }
            )

            // const result = await this.studentModel.updateMany(
            //     {
            //         _id: { $in: studentIds },
            //         isenrolled: true
            //     },
            //     {
            //         $set: { isenrolled: false },
            //         $set: { 'enrollments.$[elem].progress': 'dropout' }
            //     },
            //     {
            //         arrayFilters: [{ 'elem.progress': 'ongoing' }]
            //     }
            // );

            if (result.modifiedCount > 0) return { success: true, message: `Successfully unenrolled ${result.modifiedCount} out of ${sid.length} selected students.` }
            return { success: true, message: 'No changes were made. Selected students may already be unenrolled.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to unenroll selected students.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async unrollOne({ sid }: IStudent)
        : Promise<IPromiseStudent> {
        try {
            await this.studentModel.findByIdAndUpdate(
                sid,
                { isenrolled: false },
                { new: true }
            )

            return { success: true, message: 'Student successfully un-enrolled.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to unenroll selected students.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async insertFormPending({ sid })
        : Promise<IPromiseStudent> {
        try {
            await this.formModel.create({ sid })
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
                    progress: 'done'
                },
                { new: true }
            )
            return { success: true, message: 'Student successfully updated', idNumber }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to update student graduate', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
