import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import Alumni from './pages/Alumni/Alumni'
import GraduateStudies from './pages/Student/StudentAttrition'
import AttritionRate from './pages/Student/AttritionRate'
import ManageAlumni from './pages/Alumni/AlumniTracer'
import EnrollRate from './pages/Student/EnrollRate'
import SurvivalRate from './pages/Student/SurvivalRate'

const App = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/dashboard', element: <Dashboard /> },

    { path: '/alumni', element: <Alumni /> },
    { path: '/alumni/alumnitracer', element: <ManageAlumni /> },

    { path: '/studentattrition', element: <GraduateStudies /> },
    { path: '/studentattrition/attritionrate', element: <AttritionRate /> },
    { path: '/studentattrition/attritionrate/enrollrate', element: <EnrollRate /> },
    { path: '/studentattrition/attritionrate/survivalrate', element: <SurvivalRate /> },
])

export default App