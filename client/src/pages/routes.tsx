import { createBrowserRouter } from "react-router-dom"
import Home from "./home/Home"

const Routes = createBrowserRouter([
    { path: '/', element: <Home /> }
])

export default Routes