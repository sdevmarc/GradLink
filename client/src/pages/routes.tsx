import { createBrowserRouter } from "react-router-dom"
import Home from "./home/Home"
import Dashboard from "./dashboard/dashboard/dashboard"
import Tracer from "./dashboard/tracer/tracer"
import Student from "./dashboard/student/student"
import Program from "./dashboard/program/program"
import Alumni from "./dashboard/alumni/alumni"
import PostForm from "./dashboard/form/post-form"
import Form from "./dashboard/form/form"
import Profile from "./dashboard/settings/profile"
import Courses from "./dashboard/program/courses"

const Routes = createBrowserRouter([
    { path: '/', element: <Home /> },

    //DASHBOARD
    { path: '/dashboard', element: <Dashboard /> },

    //Tracer
    { path: '/tracer', element: <Tracer /> },

    //Alumni
    { path: '/alumni', element: <Alumni /> },

    //Student
    { path: '/student', element: <Student /> },

    //Program
    { path: '/program', element: <Program /> },
    { path: '/program/courses', element: <Courses /> },

    //Form
    { path: '/form', element: <Form /> },
    { path: '/form/create-form', element: <PostForm /> },

    //Settings
    { path: '/profile', element: <Profile /> },
])

export default Routes