import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

const App = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/dashboard', element: <Dashboard /> }
])

export default App