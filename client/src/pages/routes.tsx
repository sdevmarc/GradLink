import { createBrowserRouter } from "react-router-dom"
import Home from "./home/Home"
import Dashboard from "./dashboard/Dashboard"
import Tracer from "./dashboard/Tracer"
import Student from "./dashboard/Student"
import Program from "./dashboard/Program"
import Alumni from "./dashboard/Alumni"
import Form from "./dashboard/Form"

const Routes = createBrowserRouter([
    { path: '/', element: <Home /> },

    //DASHBOARD
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/tracer', element: <Tracer /> },
    { path: '/alumni', element: <Alumni /> },
    { path: '/student', element: <Student /> },
    { path: '/program', element: <Program /> },
    { path: '/form', element: <Form /> },
])

export default Routes