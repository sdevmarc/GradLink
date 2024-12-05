import mongoose, { Mongoose } from "mongoose"
import { MappedSection } from "src/forms/forms.interface"

export interface IStudentEnrollments {
    course?: { _id: string }
    enrollmentDate?: string
    ispass?: 'pass' | 'fail' | 'inc' | 'ongoing' | 'drop' | 'discontinue'
}

interface IUndergraduateInformation {
    college?: string
    school?: string
    programGraduated?: string
    yearGraduated?: string
}

interface IAchievements {
    awards?: string
    examPassed?: string
    examDate?: string
    examRating?: string
}

interface ICoordinates {
    latitude?: number
    longitude?: number
}

export interface IStudent {
    id?: string
    _id?: string | string[]
    userId?: mongoose.Schema.Types.ObjectId //
    idNumber?: string
    lastname?: string
    firstname?: string
    middlename?: string
    email?: string
    generalInformation?: MappedSection
    // educationalBackground?: {}
    employmentData?: MappedSection
    enrollments?: IStudentEnrollments[]
    status?: string
    isenrolled?: boolean
    isresidencylapsed?: boolean
    assessmentForm?: Express.Multer.File
    assessment?:IAssessment
    program?: string
    courses?: string[]
    undergraduateInformation?: IUndergraduateInformation
    achievements?: IAchievements
    graduation_date?: Date
    coordinates?: ICoordinates
    createdAt?: Date;
    reasons?: IAssessmentReasons
}

interface IAssessment {
    assessmentForm: Express.Multer.File
    reasons: IAssessmentReasons
}


export interface IAssessmentReasons {
    financialDifficulties: boolean
    personalFamily: boolean
    healthIssues: boolean
    workCommitments: boolean
    lackOfInterest: boolean
    relocation: boolean
    programDissatisfaction: boolean
    betterOpportunities: boolean
    timeConstraints: boolean
    careerGoals: boolean
    academicChallenges: boolean
    transfer: boolean
    visaIssues: boolean
    discrimination: boolean
    lackOfSupport: boolean
    programExpectations: boolean
    familyEmergency: boolean
    academicRigor: boolean
    mentalHealth: boolean
    specificGoals: boolean
    other: boolean
    otherText: string
}

export interface IEvaluationItem {
    id?: string;
    ispass?: 'pass' | 'fail' | 'inc' | 'ongoing' | 'drop' | 'discontinue';
    file?: string;
}

export interface IRequestStudent {
    id?: string[]
    userId?: mongoose.Schema.Types.ObjectId
    course?: string;
    evaluations?: IEvaluationItem[];
}

export interface IPromiseStudent {
    success: boolean
    message: string
    data?: IStudent[] | {}
    email?: string
}