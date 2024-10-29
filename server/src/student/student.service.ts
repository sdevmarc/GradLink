import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { IPromiseStudent, IRequestStudent, IStudent } from './student.interface'
import { IModelForm } from 'src/forms/forms.interface'
import { ICourses } from 'src/courses/courses.interface'
import { IPrograms } from 'src/programs/programs.interface'

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
                        status: { $in: ['student', 'enrollee'] }
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
                    $lookup: {
                        from: 'curriculums',
                        localField: 'program',
                        foreignField: '_id',
                        as: 'curriculumDetails'
                    }
                },
                {
                    $lookup: {
                        from: 'programs',
                        localField: 'curriculumDetails.programid',
                        foreignField: '_id',
                        as: 'programDetails'
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
                        },
                        department: { $arrayElemAt: ['$programDetails.department', 0] }
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
                    $unwind: '$programDetails'
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
                        program: '$programDetails._id',
                        department: 1,
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


    //Will be removed
    async findAllEnrollees(): Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.find({ status: 'enrollee' }).sort({ createdAt: -1 })

            return { success: true, message: 'Enrollees fetched successfully', data: response }

        } catch (error) {
            throw new HttpException({ success: false, message: 'Enrollees failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Copy paste lang sa baba, di pa nababago
    async findAllEnrolleesInCourse(courseid: string): Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.aggregate([
                // Match students with valid status
                {
                    $match: {
                        status: { $in: ['student', 'enrollee'] }
                    }
                },

                // Lookup curriculum details
                {
                    $lookup: {
                        from: 'curriculums',
                        localField: 'program',  // program field in Student now references Curriculum
                        foreignField: '_id',    // Changed from programid to _id since we're referencing Curriculum directly
                        as: 'curriculumInfo'
                    }
                },

                // Unwind curriculum array (since lookup returns an array)
                {
                    $unwind: '$curriculumInfo'
                },

                // Match students whose curriculum contains the course and is active
                {
                    $match: {
                        // 'curriculumInfo.isActive': true,
                        'curriculumInfo.categories': {
                            $elemMatch: {
                                'courses': courseid
                            }
                        }
                    }
                },

                // Match students who haven't passed or aren't currently enrolled in the course
                {
                    $match: {
                        $or: [
                            // No enrollments at all
                            { enrollments: { $size: 0 } },

                            // Has enrollments but not for this course or not passed
                            {
                                $and: [
                                    {
                                        enrollments: {
                                            $not: {
                                                $elemMatch: {
                                                    course: courseid,
                                                    ispass: 'pass'
                                                }
                                            }
                                        }
                                    },
                                    {
                                        enrollments: {
                                            $not: {
                                                $elemMatch: {
                                                    course: courseid,
                                                    ispass: 'ongoing'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },

                // Project required fields
                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        idNumber: 1,
                        lastname: 1,
                        firstname: 1,
                        middlename: 1,
                        email: 1
                    }
                }
            ]);


            return {
                success: true,
                message: 'Enrollees fetched successfully',
                data: response
            }


        } catch (error) {
            throw new HttpException({ success: false, message: 'Enrollees failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Parang nasa active curriculum bumabase
    // async findAllEnrolleesInCourse(courseid: string): Promise<IPromiseStudent> {
    //     try {
    //         const response = await this.studentModel.aggregate([
    //             // Match students with valid status
    //             {
    //                 $match: {
    //                     status: { $in: ['student', 'enrollee'] }
    //                 }
    //             },

    //             // Lookup curriculum details
    //             {
    //                 $lookup: {
    //                     from: 'curriculums',
    //                     localField: 'program',  // program field in Student now references Curriculum
    //                     foreignField: '_id',    // Changed from programid to _id since we're referencing Curriculum directly
    //                     as: 'curriculumInfo'
    //                 }
    //             },

    //             // Unwind curriculum array (since lookup returns an array)
    //             {
    //                 $unwind: '$curriculumInfo'
    //             },

    //             // Match students whose curriculum contains the course and is active
    //             {
    //                 $match: {
    //                     // 'curriculumInfo.isActive': true,
    //                     'curriculumInfo.categories': {
    //                         $elemMatch: {
    //                             'courses': courseid
    //                         }
    //                     }
    //                 }
    //             },

    //             // Match students who haven't passed or aren't currently enrolled in the course
    //             {
    //                 $match: {
    //                     $or: [
    //                         // No enrollments at all
    //                         { enrollments: { $size: 0 } },

    //                         // Has enrollments but not for this course or not passed
    //                         {
    //                             $and: [
    //                                 {
    //                                     enrollments: {
    //                                         $not: {
    //                                             $elemMatch: {
    //                                                 course: courseid,
    //                                                 ispass: 'pass'
    //                                             }
    //                                         }
    //                                     }
    //                                 },
    //                                 {
    //                                     enrollments: {
    //                                         $not: {
    //                                             $elemMatch: {
    //                                                 course: courseid,
    //                                                 ispass: 'ongoing'
    //                                             }
    //                                         }
    //                                     }
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 }
    //             },

    //             // Project required fields
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     createdAt: 1,
    //                     updatedAt: 1,
    //                     idNumber: 1,
    //                     lastname: 1,
    //                     firstname: 1,
    //                     middlename: 1,
    //                     email: 1
    //                 }
    //             }
    //         ]);


    //         return {
    //             success: true,
    //             message: 'Enrollees fetched successfully',
    //             data: response
    //         }


    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'Enrollees failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

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

    private capitalizeWords(str: string): string {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    async createEnrollee(
        { idNumber, lastname, firstname, middlename, email, program, courses }: IStudent
    ): Promise<IPromiseStudent> {
        try {
            // Input validation
            if (!idNumber || !lastname || !firstname || !email) return { success: false, message: 'Required fields (ID number, last name, first name, email) cannot be empty.' }

            // Program validation
            if (!program || typeof program !== 'string' || program.trim() === '') {
                return {
                    success: false,
                    message: 'A program must be selected.'
                };
            }

            // Normalize inputs
            const normalizedData = {
                idNumber: idNumber.toString().trim(),
                lastname: lastname.trim(),
                firstname: firstname.trim(),
                middlename: middlename?.trim() || '',
                email: email.trim().toLowerCase(),
                program: program.trim()
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(normalizedData.email)) {
                return {
                    success: false,
                    message: 'Please provide a valid email address.'
                };
            }

            // Name validation (prevent numbers and special characters)
            const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
            if (!nameRegex.test(normalizedData.lastname) ||
                !nameRegex.test(normalizedData.firstname) ||
                (normalizedData.middlename && !nameRegex.test(normalizedData.middlename))) {
                return {
                    success: false,
                    message: 'Names should only contain letters, hyphens, and apostrophes.'
                };
            }

            // ID Number validation and duplicate check
            const existingIdNumber = await this.studentModel.findOne({
                idNumber: {
                    $regex: `^${normalizedData.idNumber.replace(/\s+/g, '\\s*')}$`,
                    $options: 'i'
                }
            })

            if (existingIdNumber) return { success: false, message: 'ID Number already exists.' }

            // Email duplicate check
            const existingEmail = await this.studentModel.findOne({
                email: normalizedData.email
            })

            if (existingEmail) return { success: false, message: 'Email address already exists.' }

            // // Check for similar names to prevent duplicates
            // const similarStudent = await this.studentModel.findOne({
            //     $and: [
            //         {
            //             lastname: {
            //                 $regex: `^${normalizedData.lastname.replace(/\s+/g, '\\s*')}$`,
            //                 $options: 'i'
            //             }
            //         },
            //         {
            //             firstname: {
            //                 $regex: `^${normalizedData.firstname.replace(/\s+/g, '\\s*')}$`,
            //                 $options: 'i'
            //             }
            //         },
            //         {
            //             middlename: normalizedData.middlename ? {
            //                 $regex: `^${normalizedData.middlename.replace(/\s+/g, '\\s*')}$`,
            //                 $options: 'i'
            //             } : ''
            //         }
            //     ]
            // })

            // if (similarStudent)  return { success: false,message: 'A student with similar name already exists. Please verify if this is a duplicate entry.'}

            // Prepare student data
            const studentData = {
                idNumber: normalizedData.idNumber,
                lastname: this.capitalizeWords(normalizedData.lastname),
                firstname: this.capitalizeWords(normalizedData.firstname),
                middlename: normalizedData.middlename ? this.capitalizeWords(normalizedData.middlename) : '',
                email: normalizedData.email,
                program: new mongoose.Types.ObjectId(normalizedData.program),
                status: 'enrollee'
            };

            // Add enrollments only if courses are provided
            if (courses && Array.isArray(courses) && courses.length > 0) {
                const enrollments = courses.map(courseId => ({
                    course: new mongoose.Types.ObjectId(courseId),
                    enrollmentDate: new Date(),
                    ispass: 'ongoing'
                }));
                Object.assign(studentData, { enrollments });
            }

            // Create new student with normalized data
            const newStudent = await this.studentModel.create(studentData);

            return { success: true, message: 'Student successfully created.', }

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
