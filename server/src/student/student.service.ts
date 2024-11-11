import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { IPromiseStudent, IRequestStudent, IStudent } from './student.interface'
import { IModelForm } from 'src/forms/forms.interface'
import { ICourses } from 'src/courses/courses.interface'
import { IOffered } from 'src/offered/offered.interface'
import { ICurriculum } from 'src/curriculum/curriculum.interface'
import { MailService } from 'src/mail/mail.service'
import { IMail } from 'src/mail/mail.interface'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'

@Injectable()
export class StudentService {
    constructor(
        @InjectModel('Student') private readonly studentModel: Model<IStudent>,
        @InjectModel('Form') private readonly formModel: Model<IModelForm>,
        @InjectModel('Course') private readonly courseModel: Model<ICourses>,
        @InjectModel('Offered') private readonly offeredModel: Model<IOffered>,
        @InjectModel('Curriculum') private readonly curriculumModel: Model<ICurriculum>,
        @InjectModel('Mail') private readonly mailModel: Model<IMail>,
        private readonly mailService: MailService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async findStudentsOverlapResidency(): Promise<IPromiseStudent> {
        try {
            // First, find students who have exceeded their residency
            const studentsToUpdate = await this.studentModel.aggregate([
                // Lookup to get curriculum details
                {
                    $lookup: {
                        from: "curriculums",
                        localField: "program",
                        foreignField: "_id",
                        as: "curriculum"
                    }
                },
                // Unwind curriculum array
                {
                    $unwind: "$curriculum"
                },
                // Lookup to get program details with residency information
                {
                    $lookup: {
                        from: "programs",
                        localField: "curriculum.programid",
                        foreignField: "_id",
                        as: "programInfo"
                    }
                },
                // Unwind program array
                {
                    $unwind: "$programInfo"
                },
                // Calculate years since enrollment
                {
                    $addFields: {
                        yearsSinceEnrollment: {
                            $divide: [
                                { $subtract: [new Date(), "$createdAt"] },
                                // Convert milliseconds to years (365.25 days per year)
                                (365.25 * 24 * 60 * 60 * 1000)
                            ]
                        }
                    }
                },
                // Filter students who exceeded residency
                {
                    $match: {
                        $expr: {
                            $gt: ["$yearsSinceEnrollment", "$programInfo.residency"]
                        },
                        isenrolled: true
                    }
                },
                // Project only necessary fields
                {
                    $project: {
                        _id: 1,
                        idNumber: 1,
                        firstname: 1,
                        lastname: 1,
                        enrollments: 1,
                        yearsSinceEnrollment: 1,
                        programResidency: "$programInfo.residency"
                    }
                }
            ]);

            // Update each student's enrollment status
            const bulkOps = studentsToUpdate.map(student => ({
                updateOne: {
                    filter: { _id: student._id },
                    update: {
                        $set: {
                            isenrolled: false,
                            'enrollments.$[elem].ispass': 'discontinue'
                        }
                    },
                    arrayFilters: [{ 'elem.ispass': 'ongoing' }]
                }
            }));

            if (bulkOps.length > 0) {
                await this.studentModel.bulkWrite(bulkOps);
            }

            return {
                success: true,
                message: `Updated ${bulkOps.length} students who exceeded residency period.`,
                data: studentsToUpdate
            };

        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to find and update students who overlap residency.',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    async findAllYearrGraduated(): Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.aggregate([
                // Unwind enrollments to get individual enrollment records
                {
                    $unwind: "$enrollments"
                },
                // Lookup to get the offered course details
                {
                    $lookup: {
                        from: "offereds",
                        localField: "enrollments.course",
                        foreignField: "courses",
                        as: "offeredCourse"
                    }
                },
                // Unwind the looked up offered scourses
                {
                    $unwind: "$offeredCourse"
                },
                // Group by student and get the latest academic year
                {
                    $group: {
                        _id: "$_id",
                        latestAcademicYear: {
                            $max: {
                                startDate: "$offeredCourse.academicYear.startDate",
                                endDate: "$offeredCourse.academicYear.endDate"
                            }
                        }
                    }
                },
                // Group again to get unique academic years
                {
                    $group: {
                        _id: {
                            startDate: "$latestAcademicYear.startDate",
                            endDate: "$latestAcademicYear.endDate"
                        }
                    }
                },
                // Sort by academic year (descending)
                {
                    $sort: {
                        "_id.startDate": -1
                    }
                },
                // Format the output
                {
                    $project: {
                        _id: {
                            $toString: "$_id.startDate"
                        },
                        academicYear: {
                            $concat: [
                                { $toString: "$_id.startDate" },
                                " - ",
                                { $toString: "$_id.endDate" }
                            ]
                        }
                    }
                }
            ]);

            return {
                success: true,
                message: 'Academic years fetched successfully.',
                data: response
            };

        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch academic years.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findFilteredAlumni({ search, program, yeargraduated }: { search?: string, program?: string, yeargraduated?: string }): Promise<IPromiseStudent> {
        try {
            if (!search && !program && !yeargraduated) {
                return {
                    success: true,
                    message: 'No search parameters provided',
                    data: []
                };
            }

            const pipeline: any[] = [
                {
                    $match: {
                        status: 'alumni',
                        graduation_date: { $exists: true }
                    }
                }
            ];

            // Add search filter if provided
            if (search) {
                pipeline.push({
                    $match: {
                        $or: [
                            { idNumber: { $regex: search, $options: 'i' } },
                            { lastname: { $regex: search, $options: 'i' } },
                            { firstname: { $regex: search, $options: 'i' } },
                            { middlename: { $regex: search, $options: 'i' } }
                        ]
                    }
                });
            }

            // Add lookups
            pipeline.push(
                {
                    $lookup: {
                        from: 'curriculums',
                        localField: 'program',
                        foreignField: '_id',
                        as: 'curriculumInfo'
                    }
                },
                {
                    $unwind: '$curriculumInfo'
                },
                {
                    $lookup: {
                        from: 'programs',
                        localField: 'curriculumInfo.programid',
                        foreignField: '_id',
                        as: 'programInfo'
                    }
                },
                {
                    $unwind: '$programInfo'
                }
            );

            // Add program filter if provided
            if (program) {
                pipeline.push({
                    $match: {
                        'programInfo._id': new mongoose.Types.ObjectId(program)
                    }
                });
            }

            // Add year graduated filter if provided
            if (yeargraduated) {
                const [startYear] = yeargraduated.split('-').map(year => parseInt(year.trim()));

                pipeline.push({
                    $match: {
                        $expr: {
                            $eq: [
                                { $year: '$graduation_date' },
                                startYear
                            ]
                        }
                    }
                });
            }

            // Add the project stage last
            pipeline.push({
                $project: {
                    _id: 1,
                    idNumber: 1,
                    firstname: 1,
                    lastname: 1,
                    middlename: 1,
                    email: 1,
                    program: {
                        _id: '$programInfo._id',
                        code: '$programInfo.code',
                        descriptiveTitle: '$programInfo.descriptiveTitle',
                        department: '$programInfo.department'
                    },
                    curriculum: {
                        name: '$curriculumInfo.name',
                        major: '$curriculumInfo.major'
                    },
                    graduation_date: 1,
                    undergraduateInformation: 1,
                    achievements: 1,
                    coordinates: 1
                }
            });

            const alumni = await this.studentModel.aggregate(pipeline);

            return {
                success: true,
                message: 'Filtered alumni fetched successfully.',
                data: alumni
            };
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch filtered alumni', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findAllAlumniForTracerMap(): Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.aggregate([
                // Match only alumni
                {
                    $match: {
                        status: 'alumni',
                        'coordinates.latitude': { $exists: true },
                        'coordinates.longitude': { $exists: true }
                    }
                },
                // Lookup program information
                {
                    $lookup: {
                        from: 'curriculums',
                        localField: 'program',
                        foreignField: '_id',
                        as: 'curriculumInfo'
                    }
                },
                {
                    $unwind: '$curriculumInfo'
                },
                // Lookup program details
                {
                    $lookup: {
                        from: 'programs',
                        localField: 'curriculumInfo.programid',
                        foreignField: '_id',
                        as: 'programInfo'
                    }
                },
                {
                    $unwind: '$programInfo'
                },
                // Project the fields in the desired format
                {
                    $project: {
                        lng: '$coordinates.longitude',
                        lat: '$coordinates.latitude',
                        name: {
                            $concat: [
                                '$firstname',
                                ' ',
                                { $ifNull: ['$middlename', ''] },
                                ' ',
                                '$lastname'
                            ]
                        },
                        idNumber: '$idNumber',
                        program: '$programInfo.code',
                        yearGraduated: {
                            $concat: [
                                { $toString: { $year: '$graduation_date' } },
                                ' - ',
                                { $toString: { $add: [{ $year: '$graduation_date' }, 1] } }
                            ]
                        }
                    }
                }
            ]);

            return {
                success: true,
                message: 'Alumnis fetched successfully.',
                data: response
            };

        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch alumnis for tracer map', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findOneAlumniFromTracerMap({ id }: { id: string }): Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.aggregate([
                {
                    $match: {
                        $and: [{
                            status: { $in: ['alumni'] },
                            _id: new mongoose.Types.ObjectId(id)
                        }]

                    }
                },
                // Initial lookups
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
                // Get curriculum courses
                {
                    $lookup: {
                        from: 'courses',
                        let: {
                            curriculumCategories: {
                                $arrayElemAt: ['$curriculumDetails.categories', 0]
                            }
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: [
                                            '$_id',
                                            {
                                                $reduce: {
                                                    input: '$$curriculumCategories',
                                                    initialValue: [],
                                                    in: {
                                                        $concatArrays: ['$$value', '$$this.courses']
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'curriculumCourses'
                    }
                },
                // Improved offered courses lookup
                {
                    $lookup: {
                        from: 'offereds',
                        let: {
                            enrollmentDates: '$enrollments.enrollmentDate',
                            enrollmentCourses: '$enrollments.course'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            {
                                                $and: [
                                                    { $in: ['$_id', '$$enrollmentCourses'] },
                                                    { $eq: ['$isActive', true] }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    {
                                                        $reduce: {
                                                            input: '$$enrollmentDates',
                                                            initialValue: false,
                                                            in: {
                                                                $or: [
                                                                    '$$value',
                                                                    {
                                                                        $and: [
                                                                            { $lte: ['$createdAt', '$$this'] },
                                                                            { $gte: ['$updatedAt', '$$this'] }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        $anyElementTrue: {
                                                            $map: {
                                                                input: '$courses',
                                                                as: 'course',
                                                                in: { $in: ['$$course', '$$enrollmentCourses'] }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'offeredDetails'
                    }
                },
                // Calculate course IDs from curriculum
                {
                    $addFields: {
                        curriculumCourseIds: {
                            $reduce: {
                                input: {
                                    $arrayElemAt: ['$curriculumDetails.categories', 0]
                                },
                                initialValue: [],
                                in: {
                                    $concatArrays: ['$$value', '$$this.courses']
                                }
                            }
                        }
                    }
                },
                // Calculate additional courses (not in curriculum)
                {
                    $addFields: {
                        additionalEnrolledCourseIds: {
                            $filter: {
                                input: {
                                    $map: {
                                        input: '$enrollments',
                                        as: 'enrollment',
                                        in: '$$enrollment.course'
                                    }
                                },
                                as: 'courseId',
                                cond: {
                                    $not: { $in: ['$$courseId', '$curriculumCourseIds'] }
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        totalOfUnitsEnrolled: {
                            $add: [
                                // Units from curriculum courses
                                {
                                    $reduce: {
                                        input: '$curriculumCourses',
                                        initialValue: 0,
                                        in: { $add: ['$$value', '$$this.units'] }
                                    }
                                },
                                // Units from additional enrolled courses
                                {
                                    $reduce: {
                                        input: {
                                            $filter: {
                                                input: '$courseDetails',
                                                as: 'course',
                                                cond: {
                                                    $in: ['$$course._id', '$additionalEnrolledCourseIds']
                                                }
                                            }
                                        },
                                        initialValue: 0,
                                        in: { $add: ['$$value', '$$this.units'] }
                                    }
                                }
                            ]
                        },
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
                        },
                        detailedEnrollments: {
                            $map: {
                                input: '$enrollments',
                                as: 'enrollment',
                                in: {
                                    $let: {
                                        vars: {
                                            courseDetail: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: '$courseDetails',
                                                            as: 'course',
                                                            cond: { $eq: ['$$course._id', '$$enrollment.course'] }
                                                        }
                                                    },
                                                    0
                                                ]
                                            },
                                            matchingOffered: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: '$offeredDetails',
                                                            as: 'offered',
                                                            cond: {
                                                                $and: [
                                                                    { $in: ['$$enrollment.course', '$$offered.courses'] },
                                                                    {
                                                                        $and: [
                                                                            { $lte: ['$$offered.createdAt', '$$enrollment.enrollmentDate'] },
                                                                            { $gte: ['$$offered.updatedAt', '$$enrollment.enrollmentDate'] }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    0
                                                ]
                                            }
                                        },
                                        in: {
                                            _id: '$$courseDetail._id',
                                            code: '$$courseDetail.code',
                                            courseno: '$$courseDetail.courseno',
                                            descriptiveTitle: '$$courseDetail.descriptiveTitle',
                                            units: '$$courseDetail.units',
                                            enrollmentDate: '$$enrollment.enrollmentDate',
                                            status: '$$enrollment.ispass',
                                            semester: '$$matchingOffered.semester',
                                            // academicYear: '$$matchingOffered.academicYear'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        notTakenCourses: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: '$curriculumCourses',
                                        as: 'course',
                                        cond: {
                                            $not: {
                                                $in: [
                                                    '$$course._id',
                                                    {
                                                        $map: {
                                                            input: { $ifNull: ['$enrollments', []] },
                                                            as: 'enrollment',
                                                            in: '$$enrollment.course'
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                },
                                as: 'course',
                                in: {
                                    _id: '$$course._id',
                                    code: '$$course.code',
                                    courseno: '$$course.courseno',
                                    descriptiveTitle: '$$course.descriptiveTitle',
                                    units: '$$course.units',
                                    status: 'not_taken'
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        enrolledCourses: {
                            $concatArrays: ['$detailedEnrollments', '$notTakenCourses']
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

                // Get the last attended enrollment for each alumni
                {
                    $addFields: {
                        lastEnrollment: {
                            $arrayElemAt: [
                                { $slice: [{ $reverseArray: "$enrollments" }, 1] }, 0
                            ]
                        }
                    }
                },
                // Lookup the academic year and semester from the last attended course in the 'offereds' collection
                {
                    $lookup: {
                        from: 'offereds',
                        let: {
                            lastCourseId: "$lastEnrollment.course",
                            lastEnrollmentDate: "$lastEnrollment.enrollmentDate"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $in: ["$$lastCourseId", "$courses"] },
                                            { $lte: ["$createdAt", "$$lastEnrollmentDate"] }
                                        ]
                                    }
                                }
                            },
                            { $sort: { createdAt: -1 } }, // Get the latest offer before or on enrollment date
                            { $limit: 1 }
                        ],
                        as: 'graduationOffer'
                    }
                },
                // Unwind the offer to extract academic year and semester
                {
                    $unwind: {
                        path: '$graduationOffer',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        idNumber: 1,
                        lastname: 1,
                        firstname: 1,
                        middlename: 1,
                        email: 1,
                        generalInformation: 1,
                        employmentData: 1,
                        undergraduateInformation: 1,
                        achievements: 1,
                        program: '$programDetails._id',
                        programCode: '$programDetails.code',
                        programName: '$programDetails.descriptiveTitle',
                        isenrolled: 1,
                        department: '$programDetails.department',
                        totalOfUnitsEnrolled: 1,
                        totalOfUnitsEarned: 1,
                        enrolledCourses: 1,
                        status: 1,
                        progress: 1,
                        academicYear: {
                            $concat: [
                                { $toString: "$graduationOffer.academicYear.startDate" },
                                " - ",
                                { $toString: "$graduationOffer.academicYear.endDate" }
                            ]
                        },
                        semester: "$graduationOffer.semester",
                        graduationDate: "$graduation_date" // Preserved for clarity
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
            ])

            return { success: true, message: 'Alumni fetched successfully.', data: response[0] }
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to fetch one alimun for tracer map', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findAllStudents(): Promise<IPromiseStudent> {
        try {
            await this.findStudentsOverlapResidency()

            const response = await this.studentModel.aggregate([
                {
                    $match: {
                        status: { $in: ['student', 'enrollee'] }
                    }
                },
                // Initial lookups
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
                // Get curriculum courses
                {
                    $lookup: {
                        from: 'courses',
                        let: {
                            curriculumCategories: {
                                $arrayElemAt: ['$curriculumDetails.categories', 0]
                            }
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: [
                                            '$_id',
                                            {
                                                $reduce: {
                                                    input: '$$curriculumCategories',
                                                    initialValue: [],
                                                    in: {
                                                        $concatArrays: ['$$value', '$$this.courses']
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'curriculumCourses'
                    }
                },
                // Improved offered courses lookup
                {
                    $lookup: {
                        from: 'offereds',
                        let: {
                            enrollmentDates: '$enrollments.enrollmentDate',
                            enrollmentCourses: '$enrollments.course'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            {
                                                $and: [
                                                    { $in: ['$_id', '$$enrollmentCourses'] },
                                                    { $eq: ['$isActive', true] }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    {
                                                        $reduce: {
                                                            input: '$$enrollmentDates',
                                                            initialValue: false,
                                                            in: {
                                                                $or: [
                                                                    '$$value',
                                                                    {
                                                                        $and: [
                                                                            { $lte: ['$createdAt', '$$this'] },
                                                                            { $gte: ['$updatedAt', '$$this'] }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        $anyElementTrue: {
                                                            $map: {
                                                                input: '$courses',
                                                                as: 'course',
                                                                in: { $in: ['$$course', '$$enrollmentCourses'] }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'offeredDetails'
                    }
                },
                // Calculate course IDs from curriculum
                {
                    $addFields: {
                        curriculumCourseIds: {
                            $reduce: {
                                input: {
                                    $arrayElemAt: ['$curriculumDetails.categories', 0]
                                },
                                initialValue: [],
                                in: {
                                    $concatArrays: ['$$value', '$$this.courses']
                                }
                            }
                        }
                    }
                },
                // Calculate additional courses (not in curriculum)
                {
                    $addFields: {
                        additionalEnrolledCourseIds: {
                            $filter: {
                                input: {
                                    $map: {
                                        input: '$enrollments',
                                        as: 'enrollment',
                                        in: '$$enrollment.course'
                                    }
                                },
                                as: 'courseId',
                                cond: {
                                    $not: { $in: ['$$courseId', '$curriculumCourseIds'] }
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        totalOfUnitsEnrolled: {
                            $add: [
                                // Units from curriculum courses
                                {
                                    $reduce: {
                                        input: '$curriculumCourses',
                                        initialValue: 0,
                                        in: { $add: ['$$value', '$$this.units'] }
                                    }
                                },
                                // Units from additional enrolled courses
                                {
                                    $reduce: {
                                        input: {
                                            $filter: {
                                                input: '$courseDetails',
                                                as: 'course',
                                                cond: {
                                                    $in: ['$$course._id', '$additionalEnrolledCourseIds']
                                                }
                                            }
                                        },
                                        initialValue: 0,
                                        in: { $add: ['$$value', '$$this.units'] }
                                    }
                                }
                            ]
                        },
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
                        },
                        detailedEnrollments: {
                            $map: {
                                input: '$enrollments',
                                as: 'enrollment',
                                in: {
                                    $let: {
                                        vars: {
                                            courseDetail: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: '$courseDetails',
                                                            as: 'course',
                                                            cond: { $eq: ['$$course._id', '$$enrollment.course'] }
                                                        }
                                                    },
                                                    0
                                                ]
                                            },
                                            matchingOffered: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: '$offeredDetails',
                                                            as: 'offered',
                                                            cond: {
                                                                $and: [
                                                                    { $in: ['$$enrollment.course', '$$offered.courses'] },
                                                                    {
                                                                        $and: [
                                                                            { $lte: ['$$offered.createdAt', '$$enrollment.enrollmentDate'] },
                                                                            { $gte: ['$$offered.updatedAt', '$$enrollment.enrollmentDate'] }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    0
                                                ]
                                            }
                                        },
                                        in: {
                                            _id: '$$courseDetail._id',
                                            code: '$$courseDetail.code',
                                            courseno: '$$courseDetail.courseno',
                                            descriptiveTitle: '$$courseDetail.descriptiveTitle',
                                            units: '$$courseDetail.units',
                                            enrollmentDate: '$$enrollment.enrollmentDate',
                                            status: '$$enrollment.ispass',
                                            semester: '$$matchingOffered.semester',
                                            // academicYear: '$$matchingOffered.academicYear'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        notTakenCourses: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: '$curriculumCourses',
                                        as: 'course',
                                        cond: {
                                            $not: {
                                                $in: [
                                                    '$$course._id',
                                                    {
                                                        $map: {
                                                            input: { $ifNull: ['$enrollments', []] },
                                                            as: 'enrollment',
                                                            in: '$$enrollment.course'
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                },
                                as: 'course',
                                in: {
                                    _id: '$$course._id',
                                    code: '$$course.code',
                                    courseno: '$$course.courseno',
                                    descriptiveTitle: '$$course.descriptiveTitle',
                                    units: '$$course.units',
                                    status: 'not_taken'
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        enrolledCourses: {
                            $concatArrays: ['$detailedEnrollments', '$notTakenCourses']
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
                        undergraduateInformation: 1,
                        achievements: 1,
                        program: '$programDetails._id',
                        programCode: '$programDetails.code',
                        programName: '$programDetails.descriptiveTitle',
                        isenrolled: 1,
                        department: '$programDetails.department',
                        totalOfUnitsEnrolled: 1,
                        totalOfUnitsEarned: 1,
                        enrolledCourses: 1,
                        status: 1
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
            ])

            return { success: true, message: 'Students fetched successfully', data: response }
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Enrollees failed to fetch.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
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
            ])

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
                        isenrolled: true //Dinagdag ko
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

                // Unwind curriculum array
                {
                    $unwind: '$curriculumdetails'
                },

                // Match courses in curriculum
                {
                    $match: {
                        'curriculumdetails.categories.courses': new mongoose.Types.ObjectId(courseid)
                    }
                },

                // Match enrollments
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

                // Add field to get specific enrollment for the course
                {
                    $addFields: {
                        specificEnrollment: {
                            $filter: {
                                input: '$enrollments',
                                as: 'enrollment',
                                cond: {
                                    $eq: ['$$enrollment.course', new mongoose.Types.ObjectId(courseid)]
                                }
                            }
                        }
                    }
                },

                // Project final fields
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
                        ispass: {
                            $let: {
                                vars: {
                                    enrollmentStatus: { $arrayElemAt: ['$specificEnrollment.ispass', 0] }
                                },
                                in: {
                                    $cond: {
                                        if: { $eq: ['$$enrollmentStatus', 'ongoing'] },
                                        then: '$$REMOVE',
                                        else: '$$enrollmentStatus'
                                    }
                                }
                            }
                        }
                    }
                }
            ]);

            return { success: true, message: 'Enrollees fetched successfully', data: response };
        } catch (error) {
            throw new HttpException({ success: false, message: 'Enrollees failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR);
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
                })

            // console.log('Found offerings:', JSON.stringify(allOfferings, null, 2))

            if (!allOfferings.length) {
                return {
                    success: true,
                    message: 'No course offerings found',
                    data: {
                        latestSemester: null,
                        pastThreeSemesters: null,
                        allSemesters: null
                    }
                }
            }

            // Helper function to calculate statistics for a specific set of offerings
            const calculateStatistics = async (offerings) => {
                // First, let's find all students with this course
                const studentsWithCourse = await this.studentModel.find({
                    'enrollments.course': new mongoose.Types.ObjectId(courseid)
                })

                // console.log('Found students:', JSON.stringify(studentsWithCourse.map(s => ({
                //     _id: s._id,
                //     enrollments: s.enrollments.filter(e => e.course.toString() === courseid)
                // })), null, 2))

                // Perform the aggregation in steps for debugging
                const initialMatch = await this.studentModel.aggregate([
                    {
                        $match: {
                            'enrollments.course': new mongoose.Types.ObjectId(courseid)
                        }
                    }
                ])
                // console.log('After initial $match:', initialMatch.length)

                const afterUnwind = await this.studentModel.aggregate([
                    {
                        $match: {
                            'enrollments.course': new mongoose.Types.ObjectId(courseid)
                        }
                    },
                    {
                        $unwind: '$enrollments'
                    }
                ])
                // console.log('After $unwind:', afterUnwind.length)

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
                ]

                const results = await this.studentModel.aggregate(pipeline)
                // console.log('Final aggregation results:', JSON.stringify(results, null, 2))

                // If no results from aggregation, calculate manually from found students
                if (!results.length) {
                    // console.log('No aggregation results, calculating manually')
                    const stats: {
                        totalStudentsEnrolled: number
                        totalStudentsPassed: number
                        totalStudentsFailed: number
                        totalStudentsDropped: number
                        totalStudentsDiscontinued: number
                        totalStudentsOngoing: number
                        totalStudentsIncomplete: number
                        attritionRate?: string
                    } = {
                        totalStudentsEnrolled: 0,
                        totalStudentsPassed: 0,
                        totalStudentsFailed: 0,
                        totalStudentsDropped: 0,
                        totalStudentsDiscontinued: 0,
                        totalStudentsOngoing: 0,
                        totalStudentsIncomplete: 0
                    }

                    // Count statistics manually
                    studentsWithCourse.forEach(student => {
                        const relevantEnrollments = student.enrollments.filter(
                            e => e.course.toString() === courseid
                        )

                        relevantEnrollments.forEach(enrollment => {
                            stats.totalStudentsEnrolled++
                            switch (enrollment.ispass) {
                                case 'pass':
                                    stats.totalStudentsPassed++
                                    break
                                case 'fail':
                                    stats.totalStudentsFailed++
                                    break
                                case 'drop':
                                    stats.totalStudentsDropped++
                                    break
                                case 'discontinue':
                                    stats.totalStudentsDiscontinued++
                                    break
                                case 'ongoing':
                                    stats.totalStudentsOngoing++
                                    break
                                case 'inc':
                                    stats.totalStudentsIncomplete++
                                    break
                            }
                        })
                    })

                    // Calculate attrition rate
                    const completedStudents = stats.totalStudentsEnrolled -
                        (stats.totalStudentsOngoing + stats.totalStudentsIncomplete)

                    stats.attritionRate = completedStudents > 0
                        ? ((stats.totalStudentsFailed + stats.totalStudentsDropped +
                            stats.totalStudentsDiscontinued) / completedStudents * 100).toFixed(2)
                        : "0.00"

                    return stats
                }

                const stats = results[0]
                delete stats.studentRecords

                // Calculate attrition rate
                const completedStudents = stats.totalStudentsEnrolled -
                    (stats.totalStudentsOngoing + stats.totalStudentsIncomplete)

                stats.attritionRate = completedStudents > 0
                    ? ((stats.totalStudentsFailed + stats.totalStudentsDropped +
                        stats.totalStudentsDiscontinued) / completedStudents * 100).toFixed(2)
                    : "0.00"

                return stats
            }

            // Get relevant offering sets
            const latestOffering = [allOfferings[0]]
            const pastThreeOfferings = allOfferings.slice(0, 3)

            // Calculate statistics for each time period
            const [latestStats, pastThreeStats, allStats] = await Promise.all([
                calculateStatistics(latestOffering),
                calculateStatistics(pastThreeOfferings),
                calculateStatistics(allOfferings)
            ])

            return {
                success: true,
                message: 'Attrition rate statistics fetched successfully',
                data: {
                    latestSemester: latestStats,
                    pastThreeSemesters: pastThreeStats,
                    allSemesters: allStats
                }
            }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Enrollees failed to fetch.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findAllAlumni(): Promise<IPromiseStudent> {
        try {
            const response = await this.studentModel.aggregate([
                {
                    $match: {
                        status: { $in: ['alumni'] }
                    }
                },
                // Initial lookups
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
                // Get curriculum courses
                {
                    $lookup: {
                        from: 'courses',
                        let: {
                            curriculumCategories: {
                                $arrayElemAt: ['$curriculumDetails.categories', 0]
                            }
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: [
                                            '$_id',
                                            {
                                                $reduce: {
                                                    input: '$$curriculumCategories',
                                                    initialValue: [],
                                                    in: {
                                                        $concatArrays: ['$$value', '$$this.courses']
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'curriculumCourses'
                    }
                },
                // Improved offered courses lookup
                {
                    $lookup: {
                        from: 'offereds',
                        let: {
                            enrollmentDates: '$enrollments.enrollmentDate',
                            enrollmentCourses: '$enrollments.course'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            {
                                                $and: [
                                                    { $in: ['$_id', '$$enrollmentCourses'] },
                                                    { $eq: ['$isActive', true] }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    {
                                                        $reduce: {
                                                            input: '$$enrollmentDates',
                                                            initialValue: false,
                                                            in: {
                                                                $or: [
                                                                    '$$value',
                                                                    {
                                                                        $and: [
                                                                            { $lte: ['$createdAt', '$$this'] },
                                                                            { $gte: ['$updatedAt', '$$this'] }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        $anyElementTrue: {
                                                            $map: {
                                                                input: '$courses',
                                                                as: 'course',
                                                                in: { $in: ['$$course', '$$enrollmentCourses'] }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'offeredDetails'
                    }
                },
                // Calculate course IDs from curriculum
                {
                    $addFields: {
                        curriculumCourseIds: {
                            $reduce: {
                                input: {
                                    $arrayElemAt: ['$curriculumDetails.categories', 0]
                                },
                                initialValue: [],
                                in: {
                                    $concatArrays: ['$$value', '$$this.courses']
                                }
                            }
                        }
                    }
                },
                // Calculate additional courses (not in curriculum)
                {
                    $addFields: {
                        additionalEnrolledCourseIds: {
                            $filter: {
                                input: {
                                    $map: {
                                        input: '$enrollments',
                                        as: 'enrollment',
                                        in: '$$enrollment.course'
                                    }
                                },
                                as: 'courseId',
                                cond: {
                                    $not: { $in: ['$$courseId', '$curriculumCourseIds'] }
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        totalOfUnitsEnrolled: {
                            $add: [
                                // Units from curriculum courses
                                {
                                    $reduce: {
                                        input: '$curriculumCourses',
                                        initialValue: 0,
                                        in: { $add: ['$$value', '$$this.units'] }
                                    }
                                },
                                // Units from additional enrolled courses
                                {
                                    $reduce: {
                                        input: {
                                            $filter: {
                                                input: '$courseDetails',
                                                as: 'course',
                                                cond: {
                                                    $in: ['$$course._id', '$additionalEnrolledCourseIds']
                                                }
                                            }
                                        },
                                        initialValue: 0,
                                        in: { $add: ['$$value', '$$this.units'] }
                                    }
                                }
                            ]
                        },
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
                        },
                        detailedEnrollments: {
                            $map: {
                                input: '$enrollments',
                                as: 'enrollment',
                                in: {
                                    $let: {
                                        vars: {
                                            courseDetail: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: '$courseDetails',
                                                            as: 'course',
                                                            cond: { $eq: ['$$course._id', '$$enrollment.course'] }
                                                        }
                                                    },
                                                    0
                                                ]
                                            },
                                            matchingOffered: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: '$offeredDetails',
                                                            as: 'offered',
                                                            cond: {
                                                                $and: [
                                                                    { $in: ['$$enrollment.course', '$$offered.courses'] },
                                                                    {
                                                                        $and: [
                                                                            { $lte: ['$$offered.createdAt', '$$enrollment.enrollmentDate'] },
                                                                            { $gte: ['$$offered.updatedAt', '$$enrollment.enrollmentDate'] }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    0
                                                ]
                                            }
                                        },
                                        in: {
                                            _id: '$$courseDetail._id',
                                            code: '$$courseDetail.code',
                                            courseno: '$$courseDetail.courseno',
                                            descriptiveTitle: '$$courseDetail.descriptiveTitle',
                                            units: '$$courseDetail.units',
                                            enrollmentDate: '$$enrollment.enrollmentDate',
                                            status: '$$enrollment.ispass',
                                            semester: '$$matchingOffered.semester',
                                            // academicYear: '$$matchingOffered.academicYear'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        notTakenCourses: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: '$curriculumCourses',
                                        as: 'course',
                                        cond: {
                                            $not: {
                                                $in: [
                                                    '$$course._id',
                                                    {
                                                        $map: {
                                                            input: { $ifNull: ['$enrollments', []] },
                                                            as: 'enrollment',
                                                            in: '$$enrollment.course'
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                },
                                as: 'course',
                                in: {
                                    _id: '$$course._id',
                                    code: '$$course.code',
                                    courseno: '$$course.courseno',
                                    descriptiveTitle: '$$course.descriptiveTitle',
                                    units: '$$course.units',
                                    status: 'not_taken'
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        enrolledCourses: {
                            $concatArrays: ['$detailedEnrollments', '$notTakenCourses']
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

                // Get the last attended enrollment for each alumni
                {
                    $addFields: {
                        lastEnrollment: {
                            $arrayElemAt: [
                                { $slice: [{ $reverseArray: "$enrollments" }, 1] }, 0
                            ]
                        }
                    }
                },
                // Lookup the academic year and semester from the last attended course in the 'offereds' collection
                {
                    $lookup: {
                        from: 'offereds',
                        let: {
                            lastCourseId: "$lastEnrollment.course",
                            lastEnrollmentDate: "$lastEnrollment.enrollmentDate"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $in: ["$$lastCourseId", "$courses"] },
                                            { $lte: ["$createdAt", "$$lastEnrollmentDate"] }
                                        ]
                                    }
                                }
                            },
                            { $sort: { createdAt: -1 } }, // Get the latest offer before or on enrollment date
                            { $limit: 1 }
                        ],
                        as: 'graduationOffer'
                    }
                },
                // Unwind the offer to extract academic year and semester
                {
                    $unwind: {
                        path: '$graduationOffer',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        idNumber: 1,
                        lastname: 1,
                        firstname: 1,
                        middlename: 1,
                        email: 1,
                        generalInformation: 1,
                        employmentData: 1,
                        undergraduateInformation: 1,
                        achievements: 1,
                        program: '$programDetails._id',
                        programCode: '$programDetails.code',
                        programName: '$programDetails.descriptiveTitle',
                        isenrolled: 1,
                        department: '$programDetails.department',
                        totalOfUnitsEnrolled: 1,
                        totalOfUnitsEarned: 1,
                        enrolledCourses: 1,
                        status: 1,
                        progress: 1,
                        academicYear: {
                            $concat: [
                                { $toString: "$graduationOffer.academicYear.startDate" },
                                " - ",
                                { $toString: "$graduationOffer.academicYear.endDate" }
                            ]
                        },
                        semester: "$graduationOffer.semester",
                        graduationDate: "$graduation_date" // Preserved for clarity
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
            ])

            return { success: true, message: 'Alumni(s) fetched successfully', data: response }
        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Enrollees failed to fetch.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    private capitalizeWords(str: string): string {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    }

    async findAlumniByFilterAndSendTracer({ academicYear, program }: { academicYear: string, program: string }): Promise<IPromiseStudent> {
        try {
            // Parse academic year string (e.g., "2024 - 2025")
            const [startYear, endYear] = academicYear.split(' - ').map(year => parseInt(year));

            // Find alumni using aggregation pipeline
            const alumni = await this.studentModel.aggregate([
                {
                    $lookup: {
                        from: 'curriculums',
                        localField: 'program',
                        foreignField: '_id',
                        as: 'curriculumInfo'
                    }
                },
                {
                    $unwind: '$curriculumInfo'
                },
                {
                    $match: {
                        status: 'alumni',
                        'curriculumInfo.programid': new mongoose.Types.ObjectId(program),
                        'enrollments': {
                            $elemMatch: {
                                'enrollmentDate': {
                                    $gte: new Date(`${startYear}-01-01`),
                                    $lte: new Date(`${endYear}-12-31`)
                                },
                                'ispass': 'pass'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        email: 1,
                        firstname: 1,
                        lastname: 1,
                        program: 1,
                        lastEnrollment: {
                            $max: '$enrollments.enrollmentDate'
                        }
                    }
                }
            ]);

            if (!alumni.length) {
                return {
                    success: false,
                    message: 'No alumni found matching the criteria.'
                };
            }

            // Extract emails from alumni
            const emails = alumni.map(a => a.email);

            // Send emails
            const mailResponse = await this.mailService.sendMail({ email: emails });

            // Save mail records for tracking
            const mailRecords = alumni.map(alumnus => ({
                email: alumnus._id,
                date_sent: new Date(),
                notes: `Tracer survey sent for academic year ${academicYear} for program batch`
            }));

            await this.mailModel.insertMany(mailRecords);

            return {
                success: true,
                message: 'Tracer sent successfully!',
                data: {
                    alumniCount: alumni.length,
                    mailResponse,
                    alumni: alumni.map(a => ({
                        id: a._id,
                        name: `${a.firstname} ${a.lastname}`,
                        email: a.email,
                        lastEnrollment: a.lastEnrollment
                    }))
                }
            };

        } catch (error) {
            throw new HttpException(
                { success: false, message: 'Failed to send tracer to alumni.', error },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async createEnrollee(
        { idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements }: IStudent
    ): Promise<IPromiseStudent> {
        try {
            const { college, school, programGraduated, yearGraduated } = undergraduateInformation

            if (!college || !school || !programGraduated || !yearGraduated) return { success: false, message: 'Required fields (College, School, Program Graduated, Year Graduated) cannot be empty.' }

            // Input validation
            if (!idNumber || !lastname || !firstname || !email) return { success: false, message: 'Required fields (ID number, last name, first name, email) cannot be empty.' }

            // Program validation
            if (!program || typeof program !== 'string' || program.trim() === '') {
                return {
                    success: false,
                    message: 'A program must be selected.'
                }
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
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(normalizedData.email)) {
                return {
                    success: false,
                    message: 'Please provide a valid email address.'
                }
            }

            // Name validation (prevent numbers and special characters)
            const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/
            if (!nameRegex.test(normalizedData.lastname) ||
                !nameRegex.test(normalizedData.firstname) ||
                (normalizedData.middlename && !nameRegex.test(normalizedData.middlename))) {
                return {
                    success: false,
                    message: 'Names should only contain letters, hyphens, and apostrophes.'
                }
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
                status: 'enrollee',
                undergraduateInformation,
                achievements
            }

            // Add enrollments only if courses are provided
            if (courses && Array.isArray(courses) && courses.length > 0) {
                const enrollments = courses.map(courseId => ({
                    course: new mongoose.Types.ObjectId(courseId),
                    enrollmentDate: new Date(),
                    ispass: 'ongoing'
                }))
                Object.assign(studentData, { enrollments })
            }

            // Create new student with normalized data
            await this.studentModel.create(studentData)

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
            const iscourse = await this.courseModel.findById(course)
            if (!iscourse) {
                return {
                    success: false,
                    message: 'Course does not exist.'
                }
            }

            // Process each student enrollment with validation
            const enrollmentResults = await Promise.all(
                id.map(async (studentId) => {
                    // Find student and their existing enrollments
                    const student = await this.studentModel.findById(studentId)
                    if (!student) {
                        return {
                            success: false,
                            studentId,
                            message: 'Student not found'
                        }
                    }

                    // Find if the course is already in student's enrollments
                    const existingEnrollment = student.enrollments.find(
                        enrollment => enrollment.course.toString() === course.toString()
                    )

                    if (existingEnrollment) {
                        // Check various conditions based on existing enrollment status
                        if (existingEnrollment.ispass === 'pass') {
                            return {
                                success: false,
                                studentId,
                                message: `Student has already passed this course`
                            }
                        }

                        if (existingEnrollment.ispass === 'ongoing' || existingEnrollment.ispass === 'inc') {
                            return {
                                success: false,
                                studentId,
                                message: `Student is currently enrolled or has incomplete status in this course`
                            }
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
                            )

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
                            )

                            return {
                                success: true,
                                studentId,
                                message: `Re-enrolled in the course after previous ${existingEnrollment.ispass} status`
                            }
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
                    )

                    return {
                        success: true,
                        studentId,
                        message: 'Successfully enrolled'
                    }
                })
            )

            // Check if any enrollments failed
            const failedEnrollments = enrollmentResults.filter(result => !result.success)
            if (failedEnrollments.length > 0) {
                return {
                    success: false,
                    message: 'Some enrollments failed',
                    data: failedEnrollments
                }
            }

            return {
                success: true,
                message: `Students successfully enrolled in the course ${iscourse.descriptiveTitle}`,
                data: enrollmentResults
            }
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to enroll students.',
                    error
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async evaluateStudent(request: IRequestStudent): Promise<IPromiseStudent> {
        try {
            const { course, evaluations } = request;

            if (!course || !evaluations || !Array.isArray(evaluations) || evaluations.length === 0) {
                return {
                    success: false,
                    message: 'Invalid input parameters. Course and evaluation array are required.'
                };
            }

            const iscourse = await this.courseModel.findById(course);
            if (!iscourse) return { success: false, message: 'Course does not exist.' };

            const validStatus = ['pass', 'fail', 'inc', 'ongoing', 'drop'];
            const invalidEvaluations = evaluations.filter(
                item => !item.id || !item.ispass || !validStatus.includes(item.ispass)
            );

            if (invalidEvaluations.length > 0) {
                return {
                    success: false,
                    message: 'Invalid evaluation data. Each evaluation must contain valid student ID and status.',
                    data: invalidEvaluations
                };
            }

            const results = await Promise.all(
                evaluations.map(async (item) => {
                    try {
                        // Find the student and populate their enrollments with course IDs and units
                        const student = await this.studentModel.findById(item.id).populate({
                            path: 'enrollments.course',
                            select: '_id units'  // Populate course ID and units for calculations
                        });

                        if (!student) {
                            return {
                                success: false,
                                studentId: item.id,
                                message: 'Student not found'
                            };
                        }

                        // Check if the student is enrolled in the requested course
                        const enrollmentIndex = student.enrollments.findIndex((enrollment) => {
                            return enrollment.course._id.toString() === course.toString();
                        });

                        if (enrollmentIndex === -1) {
                            return {
                                success: false,
                                studentId: item.id,
                                message: 'Student not enrolled in this course'
                            };
                        }

                        // Update enrollment status based on evaluation
                        student.enrollments[enrollmentIndex].ispass = item.ispass;
                        await student.save();

                        // Calculate required units for the curriculum
                        const curriculum = await this.curriculumModel
                            .findById(student.program)
                            .populate({
                                path: 'categories.courses',
                                select: 'units'
                            });

                        const requiredUnits = curriculum.categories.reduce((total, category) => {
                            return total + category.courses.reduce((sum, course: any) => {
                                return sum + (course.units || 0);
                            }, 0);
                        }, 0);

                        // Calculate passed units for the student
                        const passedUnits = student.enrollments.reduce((total, enrollment) => {
                            if (enrollment.ispass === 'pass') {
                                const course = enrollment.course as any;
                                return total + (course.units || 0);
                            }
                            return total;
                        }, 0);

                        // Check if student qualifies as alumni
                        if (passedUnits >= requiredUnits) {
                            student.status = 'alumni';
                            student.graduation_date = new Date();
                            await student.save();
                        }

                        return {
                            success: true,
                            studentId: item.id,
                            status: item.ispass,
                            message: `Successfully evaluated student in ${iscourse.descriptiveTitle}`
                        };

                    } catch (error) {
                        return {
                            success: false,
                            studentId: item.id,
                            message: `Failed to update student: ${error.message}`
                        };
                    }
                })
            );

            const successfulEvaluations = results.filter(result => result.success);
            const failedEvaluations = results.filter(result => !result.success);

            return {
                success: true,
                message: `Processed ${results.length} evaluations: ${successfulEvaluations.length} successful, ${failedEvaluations.length} failed`,
                data: {
                    successful: successfulEvaluations,
                    failed: failedEvaluations,
                    course: iscourse.descriptiveTitle
                }
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to evaluate student.',
                    error
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async discontinueStudent({ id, assessmentForm }: Partial<IStudent>) {
        try {
            const uploadimage = await this.cloudinaryService.uploadFile(assessmentForm)
            if (!uploadimage) return { success: false, message: 'Header failed to update.' }
            const { secure_url } = uploadimage

            // First, get the student with populated enrollments and course references
            const student = await this.studentModel.findById(id)
                .populate({
                    path: 'enrollments.course',
                    model: 'Course'
                });

            if (!student) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'Student not found.',
                    },
                    HttpStatus.NOT_FOUND
                );
            }

            // Find the latest academic year by looking up the courses in the offered collection
            const latestOffered = await this.offeredModel.findOne({
                courses: {
                    $in: student.enrollments.map(enrollment => enrollment.course)
                }
            }).sort({ 'academicYear.startDate': -1 });

            if (!latestOffered) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'No academic year found for student enrollments.',
                    },
                    HttpStatus.NOT_FOUND
                );
            }

            // Get all course IDs from the latest academic year
            const latestYearCourseIds = latestOffered.courses.map(course => course.toString());

            // Create update object based on whether assessmentForm is provided
            const updateObject: any = {
                isenrolled: false,
                'enrollments.$[elem].ispass': 'discontinue'
            };

            // Only include assessmentForm in the update if it's provided
            if (assessmentForm !== undefined) {
                updateObject.assessmentForm = secure_url;
            }

            // Update the student document
            await this.studentModel.findByIdAndUpdate(
                id,
                {
                    $set: updateObject
                },
                {
                    arrayFilters: [
                        {
                            'elem.course': { $in: latestYearCourseIds },
                            'elem.ispass': 'ongoing' // Only update ongoing courses
                        }
                    ],
                    new: true
                }
            );

            return {
                success: true,
                message: 'Student has been discontinued successfully.'
            };

        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to discontinue student.',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
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

    async formUpdateStudent({
        email,
        generalInformation,
        // educationalBackground, 
        coordinates,
        employmentData,
        lastname,
        firstname,
        middlename
    }: IStudent
    )
        : Promise<IPromiseStudent> {
        try {
            const isstudent = await this.studentModel.findOne({ email })
            if (!isstudent) return { success: false, message: 'Student do not exist.', email }

            const filteredGeneralInformation = generalInformation.answers?.map(item => {
                const { question, answer } = item
                return { question, answer }
            })

            const filteredEmplymentData = employmentData.answers?.map(item => {
                const { question, answer } = item
                return { question, answer }
            })

            const finalEmploymentData = {
                title: employmentData?.title,
                description: employmentData?.description,
                questions: filteredEmplymentData
            }

            const finalGeneralInformation = {
                title: employmentData?.title,
                description: employmentData?.description,
                questions: filteredGeneralInformation
            }

            await this.studentModel.findOneAndUpdate(
                { email: email },
                {
                    lastname,
                    firstname,
                    middlename,
                    generalInformation: finalGeneralInformation,
                    // educationalBackground,
                    employmentData: finalEmploymentData,
                    isenrolled: false,
                    coordinates
                    // graduation_date: Date.now()
                },
                { new: true }
            )
            return { success: true, message: 'Alumni Graduate updated successfully.', email }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Failed to update student graduate', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
