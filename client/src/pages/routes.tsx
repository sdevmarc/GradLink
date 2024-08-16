import { createBrowserRouter } from "react-router-dom"
import Home from "./home/Home"
import Dashboard from "./dashboard/Dashboard"
import Tracer from "./dashboard/Tracer"

const Routes = createBrowserRouter([
    { path: '/', element: <Home /> },

    //DASHBOARD
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/tracer', element: <Tracer /> }
])

export default Routes