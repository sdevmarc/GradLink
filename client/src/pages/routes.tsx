import { createBrowserRouter } from "react-router-dom"
import Tracer from "./dashboard/tracer/tracer"
import Student from "./dashboard/student/list-of-students"
import Program from "./dashboard/program/available-programs"
import Profile from "./dashboard/settings/profile"
import Courses from "./dashboard/program/available-courses"
import Alumni from "./dashboard/student/alumni-graduates"
import CreateStudent from "./dashboard/student/create-student"
import LoginPage from "./home/login"
import { HeaderLayout, HomeHeaderLayout, TracerHeaderLayout } from "@/components/header"
import Home from "./home/home"
import CurrentEnrolledStudent from "./dashboard/student/current-enrolled"
import Overview from "./dashboard/overview/overview"
import CreateCourse from "./dashboard/program/create-course"

const Routes = createBrowserRouter([
    {
        element: <HeaderLayout />,
        children: [

            //Overview
            { path: '/overview', element: <Overview /> },

            //Student
            { path: '/student', element: <CurrentEnrolledStudent /> },
            { path: '/student/lists', element: <Student /> },
            { path: '/student/create', element: <CreateStudent /> },
            { path: '/student/alumni', element: <Alumni /> },

            //Program
            { path: '/program', element: <Program /> },
            { path: '/program/courses', element: <Courses /> },
            { path: '/program/courses/create', element: <CreateCourse /> },

            //Form
            // { path: '/form', element: <Form /> },
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
            { path: '/', element: <Home /> },
            { path: '/login', element: <LoginPage /> },
        ]
    }
])

export default Routes