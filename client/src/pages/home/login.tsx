import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { GraduationCap, Users, BarChart, Lock } from 'lucide-react'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        navigate(ROUTES.OVERVIEW)
    }

    return (
        <div className="w-full flex flex-col">
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-4xl mx-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold">Gradlink</CardTitle>
                        <CardDescription>Admin Access Portal</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold">Welcome, Administrator</h2>
                            <p className="text-muted-foreground">
                                Access Gradlink the Alumni Graduate Tracer system to manage and analyze graduate data efficiently.
                                This application is accessible only through the local network for enhanced security.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <GraduationCap className="h-5 w-5 text-blue-500" />
                                    <span>Track Graduates</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Users className="h-5 w-5 text-green-500" />
                                    <span>Manage Alumni</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <BarChart className="h-5 w-5 text-purple-500" />
                                    <span>Generate Reports</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Lock className="h-5 w-5 text-red-500" />
                                    <span>Secure Access</span>
                                </div>
                            </div>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Admin Login</CardTitle>
                                <CardDescription>Please enter your credentials to access the system.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleLogin}>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="username">Username</Label>
                                            <Input
                                                id="username"
                                                placeholder="Enter your username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button className="w-full" type="submit">Login</Button>
                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter>
                                <Link to={`/`} className="w-full text-primary text-center text-sm font-semibold underline">
                                    Forgot your password?
                                </Link>
                            </CardFooter>
                        </Card>
                    </CardContent>
                    <CardFooter className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Gradlink: Alumni Graduate Tracer. All rights reserved. | For authorized use only.
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

const Header = () => {
    const navigate = useNavigate()

    const handleGoBack = () => {
        navigate(-1)
    }
    return (
        <div className="fixed top-0 w-full h-[4rem] flex justify-center items-center">
            <div className="w-full max-w-[90rem] h-full px-4 flex justify-between items-center">
                <h1>LOGO</h1>
                <Button onClick={handleGoBack} variant={`ghost`} size={`sm`}>
                    Go Back
                </Button>
            </div>
        </div>
    )
}