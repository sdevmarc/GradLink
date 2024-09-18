import { createBrowserRouter } from "react-router-dom"
import Dashboard from "./dashboard/dashboard/dashboard"
import Tracer from "./dashboard/tracer/tracer"
import Student from "./dashboard/student/student"
import Program from "./dashboard/program/program"
import Profile from "./dashboard/settings/profile"
import Courses from "./dashboard/program/courses"
import Alumni from "./dashboard/student/alumni"
import CreateStudent from "./dashboard/student/create-student"
import LoginPage from "./home/login"
import { HeaderLayout, HomeHeaderLayout, TracerHeaderLayout } from "@/components/header"
import Home from "./home/home"

const Routes = createBrowserRouter([
    {
        element: <HeaderLayout />,
        children: [

            //DASHBOARD
            { path: '/overview', element: <Dashboard /> },

            //Student
            { path: '/student', element: <Student /> },
            { path: '/student/create', element: <CreateStudent /> },
            { path: '/student/alumni', element: <Alumni /> },

            //Program
            { path: '/program', element: <Program /> },
            { path: '/program/courses', element: <Courses /> },

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