import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { IPromiseStudent, IRequestStudent, IStudent } from './student.interface'
import { IModelForm } from 'src/forms/forms.interface'
import { ICourses } from 'src/courses/courses.interface'
import { IOffered } from 'src/offered/offered.interface'

@Injectable()
export class StudentService {
    constructor(
        @InjectModel('Student') private readonly studentModel: Model<IStudent>,
        @InjectModel('Form') private readonly formModel: Model<IModelForm>,
        @InjectModel('Course') private readonly courseModel: Model<ICourses>,
        @InjectModel('Offered') private readonly offeredModel: Model<IOffered>,
    ) { }

    async findAllStudents(): Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.aggregate([
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
                        // Fixed calculation for total units earned
                        totalOfUnitsEarned: {
                            $reduce: {
                                input: {
                                    $filter: {
                                        input: '$enrollments',
                                        as: 'enrollment',
                                        cond: { $eq: ['$$enrollment.ispass', 'pass'] }
                                    }
                                },
                                initialValue: 0,
                                in: {
                                    $add: [
                                        '$$value',
                                        {
                                            $let: {
                                                vars: {
                                                    matchedCourse: {
                                                        $arrayElemAt: [
                                                            {
                                                                $filter: {
                                                                    input: '$courseDetails',
                                                                    as: 'course',
                                                                    cond: { $eq: ['$$course._id', '$$this.course'] }
                                                                }
                                                            },
                                                            0
                                                        ]
                                                    }
                                                },
                                                in: '$$matchedCourse.units'
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        progress: {
                            $cond: {
                                if: {
                                    $and: [
                                        { $gt: ['$totalOfUnitsEnrolled', 0] },
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
                    $unwind: '$curriculumDetails'
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
                        programCode: '$programDetails.code',
                        programName: '$programDetails.descriptiveTitle',
                        isenrolled: 1,
                        department: '$programDetails.department',
                        totalOfUnitsEnrolled: 1,
                        totalOfUnitsEarned: 1
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
            ]);

            return { success: true, message: 'Students fetched successfully', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Enrollees failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findAllEnrolleesInCourse(courseid: string): Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.aggregate([
                // Match students with valid status
                {
                    $match: {
                        $and: [{
                            status: { $in: ['student', 'enrollee'] },
                            isenrolled: true //Dinagdag ko
                        }]
                    }
                },

                // Lookup curriculum details
                {
                    $lookup: {
                        from: 'curriculums',
                        localField: 'program',
                        foreignField: '_id',
                        as: 'curriculumdetails'
                    }
                },

                // // Unwind curriculum array (since lookup returns an array)
                {
                    $unwind: '$curriculumdetails'
                },
                {
                    $match: {
                        'curriculumdetails.categories.courses': new mongoose.Types.ObjectId(courseid)
                    }
                },

                {
                    $match: {
                        $or: [
                            { enrollments: { $size: 0 } },
                            {
                                enrollments: {
                                    $not: {
                                        $elemMatch: {
                                            course: new mongoose.Types.ObjectId(courseid),
                                            ispass: { $in: ['pass', 'ongoing', 'inc'] }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },

                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        idNumber: 1,
                        lastname: 1,
                        firstname: 1,
                        middlename: 1,
                        email: 1,
                        program: '$curriculumdetails.programid',
                        department: '$curriculumdetails.department'
                    }
                }
            ]);

            return { success: true, message: 'Enrollees fetched successfully', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Enrollees failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findAllStudentsInCourseForEvaluation(courseid: string): Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.aggregate([
                // Match students with valid status
                {
                    $match: {
                        status: { $in: ['student'] },
                    }
                },

                // Lookup curriculum details
                {
                    $lookup: {
                        from: 'curriculums',
                        localField: 'program',
                        foreignField: '_id',
                        as: 'curriculumdetails'
                    }
                },

                // // Unwind curriculum array (since lookup returns an array)
                {
                    $unwind: '$curriculumdetails'
                },
                {
                    $match: {
                        'curriculumdetails.categories.courses': new mongoose.Types.ObjectId(courseid)
                    }
                },

                {
                    $match: {
                        enrollments: {
                            $elemMatch: {
                                course: new mongoose.Types.ObjectId(courseid),
                                ispass: { $in: ['ongoing', 'inc'] }
                            }
                        }
                    }
                },

                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        idNumber: 1,
                        lastname: 1,
                        firstname: 1,
                        middlename: 1,
                        email: 1,
                        program: '$curriculumdetails.programid',
                        department: '$curriculumdetails.department'
                    }
                }
            ]);

            return { success: true, message: 'Enrollees fetched successfully', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Enrollees failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findAllStudentsInCourseForAttritionRate(courseid: string): Promise<IPromiseStudent> {
        try {
            // Get all offerings sorted by date
            const allOfferings = await this.offeredModel
                .find({ courses: new mongoose.Types.ObjectId(courseid) })
                .sort({
                    'academicYear.endDate': -1,
                    'semester': -1
                });

            console.log('Found offerings:', JSON.stringify(allOfferings, null, 2));

            if (!allOfferings.length) {
                return {
                    success: true,
                    message: 'No course offerings found',
                    data: {
                        latestSemester: null,
                        pastThreeSemesters: null,
                        allSemesters: null
                    }
                };
            }

            // Helper function to calculate statistics for a specific set of offerings
            const calculateStatistics = async (offerings) => {
                // First, let's find all students with this course
                const studentsWithCourse = await this.studentModel.find({
                    'enrollments.course': new mongoose.Types.ObjectId(courseid)
                });

                console.log('Found students:', JSON.stringify(studentsWithCourse.map(s => ({
                    _id: s._id,
                    enrollments: s.enrollments.filter(e => e.course.toString() === courseid)
                })), null, 2));

                // Perform the aggregation in steps for debugging
                const initialMatch = await this.studentModel.aggregate([
                    {
                        $match: {
                            'enrollments.course': new mongoose.Types.ObjectId(courseid)
                        }
                    }
                ]);
                console.log('After initial $match:', initialMatch.length);

                const afterUnwind = await this.studentModel.aggregate([
                    {
                        $match: {
                            'enrollments.course': new mongoose.Types.ObjectId(courseid)
                        }
                    },
                    {
                        $unwind: '$enrollments'
                    }
                ]);
                console.log('After $unwind:', afterUnwind.length);

                // Final aggregation pipeline
                const pipeline = [
                    {
                        $match: {
                            'enrollments.course': new mongoose.Types.ObjectId(courseid)
                        }
                    },
                    {
                        $unwind: '$enrollments'
                    },
                    {
                        $match: {
                            'enrollments.course': new mongoose.Types.ObjectId(courseid)
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalStudentsEnrolled: { $sum: 1 },
                            totalStudentsPassed: {
                                $sum: { $cond: [{ $eq: ['$enrollments.ispass', 'pass'] }, 1, 0] }
                            },
                            totalStudentsFailed: {
                                $sum: { $cond: [{ $eq: ['$enrollments.ispass', 'fail'] }, 1, 0] }
                            },
                            totalStudentsDropped: {
                                $sum: { $cond: [{ $eq: ['$enrollments.ispass', 'drop'] }, 1, 0] }
                            },
                            totalStudentsDiscontinued: {
                                $sum: { $cond: [{ $eq: ['$enrollments.ispass', 'discontinue'] }, 1, 0] }
                            },
                            totalStudentsOngoing: {
                                $sum: { $cond: [{ $eq: ['$enrollments.ispass', 'ongoing'] }, 1, 0] }
                            },
                            totalStudentsIncomplete: {
                                $sum: { $cond: [{ $eq: ['$enrollments.ispass', 'inc'] }, 1, 0] }
                            },
                            studentRecords: {
                                $push: {
                                    enrollmentDate: '$enrollments.enrollmentDate',
                                    ispass: '$enrollments.ispass'
                                }
                            }
                        }
                    }
                ];

                const results = await this.studentModel.aggregate(pipeline);
                console.log('Final aggregation results:', JSON.stringify(results, null, 2));

                // If no results from aggregation, calculate manually from found students
                if (!results.length) {
                    console.log('No aggregation results, calculating manually');
                    const stats: {
                        totalStudentsEnrolled: number;
                        totalStudentsPassed: number;
                        totalStudentsFailed: number;
                        totalStudentsDropped: number;
                        totalStudentsDiscontinued: number;
                        totalStudentsOngoing: number;
                        totalStudentsIncomplete: number;
                        attritionRate?: string;
                    } = {
                        totalStudentsEnrolled: 0,
                        totalStudentsPassed: 0,
                        totalStudentsFailed: 0,
                        totalStudentsDropped: 0,
                        totalStudentsDiscontinued: 0,
                        totalStudentsOngoing: 0,
                        totalStudentsIncomplete: 0
                    };

                    // Count statistics manually
                    studentsWithCourse.forEach(student => {
                        const relevantEnrollments = student.enrollments.filter(
                            e => e.course.toString() === courseid
                        );

                        relevantEnrollments.forEach(enrollment => {
                            stats.totalStudentsEnrolled++;
                            switch (enrollment.ispass) {
                                case 'pass':
                                    stats.totalStudentsPassed++;
                                    break;
                                case 'fail':
                                    stats.totalStudentsFailed++;
                                    break;
                                case 'drop':
                                    stats.totalStudentsDropped++;
                                    break;
                                case 'discontinue':
                                    stats.totalStudentsDiscontinued++;
                                    break;
                                case 'ongoing':
                                    stats.totalStudentsOngoing++;
                                    break;
                                case 'inc':
                                    stats.totalStudentsIncomplete++;
                                    break;
                            }
                        });
                    });

                    // Calculate attrition rate
                    const completedStudents = stats.totalStudentsEnrolled -
                        (stats.totalStudentsOngoing + stats.totalStudentsIncomplete);

                    stats.attritionRate = completedStudents > 0
                        ? ((stats.totalStudentsFailed + stats.totalStudentsDropped +
                            stats.totalStudentsDiscontinued) / completedStudents * 100).toFixed(2)
                        : "0.00";

                    return stats;
                }

                const stats = results[0];
                delete stats.studentRecords;

                // Calculate attrition rate
                const completedStudents = stats.totalStudentsEnrolled -
                    (stats.totalStudentsOngoing + stats.totalStudentsIncomplete);

                stats.attritionRate = completedStudents > 0
                    ? ((stats.totalStudentsFailed + stats.totalStudentsDropped +
                        stats.totalStudentsDiscontinued) / completedStudents * 100).toFixed(2)
                    : "0.00";

                return stats;
            };

            // Get relevant offering sets
            const latestOffering = [allOfferings[0]];
            const pastThreeOfferings = allOfferings.slice(0, 3);

            // Calculate statistics for each time period
            const [latestStats, pastThreeStats, allStats] = await Promise.all([
                calculateStatistics(latestOffering),
                calculateStatistics(pastThreeOfferings),
                calculateStatistics(allOfferings)
            ]);

            return {
                success: true,
                message: 'Attrition rate statistics fetched successfully',
                data: {
                    latestSemester: latestStats,
                    pastThreeSemesters: pastThreeStats,
                    allSemesters: allStats
                }
            };
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
                isenrolled: true,
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
            await this.studentModel.create(studentData);

            return { success: true, message: 'Student successfully created.', }

        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create student.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async enrollStudent(
        { course, id }: IRequestStudent
    ): Promise<IPromiseStudent> {
        try {
            // Check if course exists
            const iscourse = await this.courseModel.findById(course);
            if (!iscourse) {
                return {
                    success: false,
                    message: 'Course does not exist.'
                };
            }

            // Process each student enrollment with validation
            const enrollmentResults = await Promise.all(
                id.map(async (studentId) => {
                    // Find student and their existing enrollments
                    const student = await this.studentModel.findById(studentId);
                    if (!student) {
                        return {
                            success: false,
                            studentId,
                            message: 'Student not found'
                        };
                    }

                    // Find if the course is already in student's enrollments
                    const existingEnrollment = student.enrollments.find(
                        enrollment => enrollment.course.toString() === course.toString()
                    );

                    if (existingEnrollment) {
                        // Check various conditions based on existing enrollment status
                        if (existingEnrollment.ispass === 'pass') {
                            return {
                                success: false,
                                studentId,
                                message: `Student has already passed this course`
                            };
                        }

                        if (existingEnrollment.ispass === 'ongoing' || existingEnrollment.ispass === 'inc') {
                            return {
                                success: false,
                                studentId,
                                message: `Student is currently enrolled or has incomplete status in this course`
                            };
                        }

                        if (['fail', 'drop', 'discontinue'].includes(existingEnrollment.ispass)) {
                            // Remove the old enrollment and add new one
                            await this.studentModel.findByIdAndUpdate(
                                studentId,
                                {
                                    isenrolled: true,
                                    status: 'student',
                                    $pull: { enrollments: { course: course } },
                                }
                            );

                            await this.studentModel.findByIdAndUpdate(
                                studentId,
                                {
                                    $push: {
                                        enrollments: {
                                            course,
                                            enrollmentDate: new Date(),
                                            ispass: 'ongoing'
                                        }
                                    }
                                }
                            );

                            return {
                                success: true,
                                studentId,
                                message: `Re-enrolled in the course after previous ${existingEnrollment.ispass} status`
                            };
                        }
                    }

                    // If no existing enrollment or passed all checks, enroll the student
                    await this.studentModel.findByIdAndUpdate(
                        studentId,
                        {
                            isenrolled: true,
                            status: 'student',
                            $push: {
                                enrollments: {
                                    course,
                                    enrollmentDate: new Date(),
                                    ispass: 'ongoing'
                                }
                            }
                        }
                    );

                    return {
                        success: true,
                        studentId,
                        message: 'Successfully enrolled'
                    };
                })
            );

            // Check if any enrollments failed
            const failedEnrollments = enrollmentResults.filter(result => !result.success);
            if (failedEnrollments.length > 0) {
                return {
                    success: false,
                    message: 'Some enrollments failed',
                    data: failedEnrollments
                };
            }

            return {
                success: true,
                message: `Students successfully enrolled in the course ${iscourse.descriptiveTitle}`,
                data: enrollmentResults
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to enroll students.',
                    error
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async evaluateStudent(
        { ispass, course, id }: IRequestStudent
    ): Promise<IPromiseStudent> {
        try {
            if (!course || !id || !Array.isArray(id) || id.length === 0) {
                return {
                    success: false,
                    message: 'Invalid input parameters. Course and student IDs are required.'
                };
            }

            // Validate ispass value against enum
            if (ispass && !['pass', 'fail', 'inc', 'ongoing', 'drop', 'discontinue'].includes(ispass)) {
                return {
                    success: false,
                    message: 'Invalid ispass value.'
                };
            }

            const iscourse = await this.courseModel.findById(course)
            if (!iscourse) return { success: false, message: 'Course do not exists.' }

            const updateResults = await Promise.all(
                id.map(async (studentId) => {
                    try {
                        const student = await this.studentModel.findById(studentId);
                        if (!student) return { success: false, studentId, message: 'Student not found' }

                        const enrollmentIndex = student.enrollments.findIndex(
                            enrollment => enrollment.course.toString() === course
                        )

                        if (enrollmentIndex === -1) return { success: false, studentId, message: 'Student not enrolled in this course' }

                        // Update the enrollment status
                        student.isenrolled = false //Dinagdag ko
                        student.enrollments[enrollmentIndex].ispass = ispass;
                        await student.save();

                        return { success: true, studentId, message: 'Successfully updated' }
                    } catch (error) {
                        return {
                            success: false,
                            studentId,
                            message: 'Failed to update student',
                            error: error.message
                        }
                    }
                })
            )

            // Analyze results
            const failedUpdates = updateResults.filter(result => !result.success);
            if (failedUpdates.length > 0) {
                return {
                    success: false,
                    message: 'Some students could not be evaluated',
                    data: {
                        successCount: updateResults.length - failedUpdates.length,
                        failureCount: failedUpdates.length,
                        failures: failedUpdates
                    }
                }
            }

            return { success: true, message: `Successfully evaluated ${updateResults.length} student(s) in ${iscourse.descriptiveTitle}`, }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to evaluate student.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async activateExisitngStudent(studentid: string) {
        try {
            await this.studentModel.findByIdAndUpdate(
                studentid,
                { isenrolled: true },
                { new: true }
            )
            return { success: true, message: 'Student activated successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to create form pending.' }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

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
