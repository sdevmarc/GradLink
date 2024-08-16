import { createBrowserRouter } from "react-router-dom"
import Home from "./home/Home"
import Dashboard from "./dashboard/Dashboard"
import Tracer from "./dashboard/Tracer"
import Student from "./dashboard/Student"

const Routes = createBrowserRouter([
    { path: '/', element: <Home /> },

    //DASHBOARD
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/tracer', element: <Tracer /> },
    { path: '/student', element: <Student /> },
])

export default Routes