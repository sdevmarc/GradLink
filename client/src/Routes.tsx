import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Alumni from './pages/Alumni'
import GraduateStudies from './pages/StudentAttrition'
import AttritionRate from './pages/AttritionRate'
import ManageAlumni from './pages/AlumniTracer'

const App = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/alumni', element: <Alumni /> },
    { path: '/alumni/alumnitracer', element: <ManageAlumni /> },
    { path: '/studentattrition', element: <GraduateStudies /> },
    { path: '/studentattrition/attritionrate', element: <AttritionRate /> }
])

export default App