import { createBrowserRouter } from "react-router-dom"
import Tracer from "./dashboard/tracer/tracer"
import Program from "./dashboard/program/available-programs"
import Profile from "./dashboard/settings/profile"
import LoginPage from "./home/login"
import { HeaderLayout, HomeHeaderLayout, TracerHeaderLayout } from "@/components/header"
import Overview from "./dashboard/overview/overview"
import CreateCourse from "./dashboard/program/create-course"
import Form from "./dashboard/form/form"
import ViewDetails from "./dashboard/student/view-details"
import CreateProgram from "./dashboard/program/create-program"
import CreateCurriculum from "./dashboard/program/create-curriculum"
import ViewProgramDetails from "./dashboard/program/view-program-details"
import Enrollment from "./dashboard/enrollment/courses-offered"
import CreateCoursesOffered from "./dashboard/enrollment/create-course-offered"
import NewStudent from "./dashboard/student/new-student"
import EnrollStudent from "./dashboard/enrollment/enroll-student"
import ListOfStudents from "./dashboard/student/list-of-students"

const Routes = createBrowserRouter([
    {
        element: <HeaderLayout />,
        children: [

            //Overview
            { path: '/overview', element: <Overview /> },

            //Enrollment
            { path: '/enrollment', element: <Enrollment /> },
            { path: '/enrollment/create-course-offered', element: <CreateCoursesOffered /> },
            { path: '/enrollment/new-student', element: <NewStudent /> },
            { path: '/enrollment/enroll-student/:id', element: <EnrollStudent /> },

            //Student
            { path: '/student', element: <ListOfStudents /> },
            { path: '/student/details/:sid', element: <ViewDetails /> },

            //Program
            { path: '/program', element: <Program /> },
            { path: '/program/details/:id', element: <ViewProgramDetails /> },
            { path: '/program/create-program', element: <CreateProgram /> },
            { path: '/program/create-course', element: <CreateCourse /> },
            { path: '/program/create-curriculum', element: <CreateCurriculum /> },

            //Form
            { path: '/form', element: <Form /> },
            // { path: '/form/create-form', element: <PostForm /> },

            //Settings
            { path: '/profile', element: <Profile /> },
        ]
    },
    {
        element: <TracerHeaderLayout />,
        children: [
            { path: '/tracer', element: <Tracer /> },
        ]
    },
    {
        element: <HomeHeaderLayout />,
        children: [
            // { path: '/', element: <Home /> },
            { path: '/', element: <LoginPage /> },
        ]
    }
])

export default Routes