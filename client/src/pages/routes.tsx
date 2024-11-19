import { createBrowserRouter } from "react-router-dom"
import Tracer from "./dashboard/tracer/tracer"
import Program from "./dashboard/program/available-programs"
import LoginPage from "./home/login"
import { HeaderLayout, HomeHeaderLayout, SettingsLayout, TracerHeaderLayout } from "@/components/header"
import Overview from "./dashboard/overview/overview"
import CreateCourse from "./dashboard/program/create-course"
import Form from "./dashboard/form/form"
import CreateProgram from "./dashboard/program/create-program"
import CreateCurriculum from "./dashboard/program/create-curriculum"
import ViewProgramDetails from "./dashboard/program/view-program-details"
import Enrollment from "./dashboard/enrollment/courses-offered"
import CreateCoursesOffered from "./dashboard/enrollment/create-course-offered"
import NewStudent from "./dashboard/student/new-student"
import EnrollStudent from "./dashboard/enrollment/enroll-student"
import ListOfStudents from "./dashboard/student/list-of-students"
import EvaluateStudent from "./dashboard/enrollment/evaluate-student"
import Alumni from "./dashboard/alumni/alumni"
import AttritionRateCourses from "./dashboard/enrollment/attrition-rate-courses"
import AttritionRatePrograms from "./dashboard/enrollment/attrition-rate-programs"
import TracerMap from "./dashboard/alumni/tracer-map"
import GeneralSettings from "./dashboard/settings/general"
import AuditLog from "./dashboard/settings/audit-log"
import Security from "./dashboard/settings/security"
import GoogleForm from "./dashboard/alumni/google-form"
import ArchivedAcademicYearOfferedCourses from "./dashboard/enrollment/archive-academic-year-offered-courses"
import ArchivedSemestersInAcademicYear from "./dashboard/enrollment/achived-semesters-in-academic-year"
import ProtectedRoute from "@/components/protected-route"
import UpdateStudent from "./dashboard/student/update-student-information"
import UpdateOfferedCourses from "./dashboard/enrollment/update-offered-courses"

const Routes = createBrowserRouter([
    {
        element: <HeaderLayout />,
        children: [

            //Overview
            {
                path: '/overview',
                element: (
                    <ProtectedRoute>
                        <Overview />
                    </ProtectedRoute>
                )
            },

            //Enrollment
            {
                path: '/enrollment',
                element: (
                    <ProtectedRoute>
                        <Enrollment />
                    </ProtectedRoute>
                )
            },
            {
                path: '/enrollment/archived-academic-year-courses-offered',
                element: (
                    <ProtectedRoute>
                        <ArchivedAcademicYearOfferedCourses />
                    </ProtectedRoute>
                )
            },
            {
                path: '/enrollment/archived-semesters-in-academic-year/:id',
                element: (
                    <ProtectedRoute>
                        <ArchivedSemestersInAcademicYear />
                    </ProtectedRoute>
                )
            },
            {
                path: '/enrollment/attrition-rate-courses',
                element: (
                    <ProtectedRoute>
                        <AttritionRateCourses />
                    </ProtectedRoute>
                )
            },
            {
                path: '/enrollment/attrition-rate-programs',
                element: (
                    <ProtectedRoute>
                        <AttritionRatePrograms />
                    </ProtectedRoute>
                )
            },
            {
                path: '/enrollment/create-course-offered',
                element: (
                    <ProtectedRoute>
                        <CreateCoursesOffered />
                    </ProtectedRoute>
                )
            },
            {
                path: '/enrollment/update-course-offered',
                element: (
                    <ProtectedRoute>
                        <UpdateOfferedCourses />
                    </ProtectedRoute>
                )
            },
            {
                path: '/enrollment/enroll-student/:id',
                element: (
                    <ProtectedRoute>
                        <EnrollStudent />
                    </ProtectedRoute>
                )
            },
            {
                path: '/enrollment/evaluate-student/:id',
                element: (
                    <ProtectedRoute>
                        <EvaluateStudent />
                    </ProtectedRoute>
                )
            },

            //Student
            {
                path: '/student',
                element: (
                    <ProtectedRoute>
                        <ListOfStudents />
                    </ProtectedRoute>
                )
            },
            {
                path: '/student/new-student',
                element: (
                    <ProtectedRoute>
                        <NewStudent />
                    </ProtectedRoute>
                )
            },
            {
                path: '/student/details/:sid',
                element: (
                    <ProtectedRoute>
                        <UpdateStudent />
                    </ProtectedRoute>
                )
            },

            //Alumni
            {
                path: '/alumni',
                element: (
                    <ProtectedRoute>
                        <Alumni />
                    </ProtectedRoute>
                )
            },
            {
                path: '/alumni/tracer',
                element: (
                    <ProtectedRoute>
                        <TracerMap />
                    </ProtectedRoute>
                )
            },
            {
                path: '/alumni/google-form',
                element: (
                    <ProtectedRoute>
                        <GoogleForm />
                    </ProtectedRoute>
                )
            },

            //Program
            {
                path: '/program',
                element: (
                    <ProtectedRoute>
                        <Program />
                    </ProtectedRoute>
                )
            },
            {
                path: '/program/details/:id',
                element: (
                    <ProtectedRoute>
                        <ViewProgramDetails />
                    </ProtectedRoute>
                )
            },
            {
                path: '/program/create-program',
                element: (
                    <ProtectedRoute>
                        <CreateProgram />
                    </ProtectedRoute>
                )
            },
            {
                path: '/program/create-course',
                element: (
                    <ProtectedRoute>
                        <CreateCourse />
                    </ProtectedRoute>
                )
            },
            {
                path: '/program/create-curriculum',
                element: (
                    <ProtectedRoute>
                        <CreateCurriculum />
                    </ProtectedRoute>
                )
            },

            //Form
            {
                path: '/form',
                element: (
                    <ProtectedRoute>
                        <Form />
                    </ProtectedRoute>
                )
            },


        ]
    },
    {
        element: <TracerHeaderLayout />,
        children: [
            {
                path: '/tracer',
                element: (
                    <ProtectedRoute>
                        <Tracer />
                    </ProtectedRoute>
                )
            },
        ]
    },
    {
        element: <HomeHeaderLayout />,
        children: [
            {
                path: '/',
                element: <LoginPage />
            },
        ]
    },
    {
        element: <SettingsLayout />,
        children: [
            //Settings
            {
                path: '/account',
                element: (
                    <ProtectedRoute>
                        <GeneralSettings />
                    </ProtectedRoute>
                )
            },
            {
                path: '/audit-log',
                element: (
                    <ProtectedRoute>
                        <AuditLog />
                    </ProtectedRoute>
                )
            },
            {
                path: '/account/security',
                element: (
                    <ProtectedRoute>
                        <Security />
                    </ProtectedRoute>
                )
            },
        ]
    }
])

export default Routes