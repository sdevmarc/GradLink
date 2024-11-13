import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import Routes from './pages/routes.tsx'
import { ThemeProvider } from './hooks/useTheme.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from './hooks/AuthContext.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={Routes} />
                    <Toaster />
                </QueryClientProvider>
            </ThemeProvider>
        </AuthProvider>
    </React.StrictMode>,
)
