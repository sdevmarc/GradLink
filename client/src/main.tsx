import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from "@/components/theme-provider"
import './index.css'
import { RouterProvider } from 'react-router-dom'
import Routes from './routes'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={Routes} />
        </ThemeProvider>
    </React.StrictMode>,
)
