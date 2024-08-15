import { createBrowserRouter } from "react-router-dom"
import Home from "./home/Home"
import Dashboard from "./dashboard/Dashboard"

const Routes = createBrowserRouter([
    { path: '/', element: <Home /> },

    //DASHBOARD
    { path: '/dashboard', element: <Dashboard /> }
])

export default Routes