import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { GraduationCap, EyeOff, Eye } from 'lucide-react'
import SMU from '@/assets/SMU Main Emblem - For dark color backgrounds.png'
import SOGS from '@/assets/SMU Unit Emblem - SoGS 1by1.png'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        navigate(ROUTES.OVERVIEW)
    }

    return (
        <div className="w-full flex flex-col">
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-evenly p-4">
                <div className="flex items-center gap-8">
                    <img src={SMU}
                        alt="SMY Logo"
                        className="w-[10rem] h-[10rem]"
                    />
                    <img src={SOGS}
                        alt="SMY Logo"
                        className="w-[10rem] h-[10rem]"
                    />
                </div>

                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">GradLink</CardTitle>
                        <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    // type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs text-muted-foreground hover:text-primary"
                                        onClick={() => alert('Forgot password functionality to be implemented')}
                                    >
                                        Forgot password?
                                    </Button>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            {/* {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )} */}
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button className="w-full" type="submit">
                                Log in
                                {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in.. */}
                            </Button>
                            {/* <p className="text-sm text-center text-muted-foreground">
                                Don't have an account?{' '}
                                <Button
                                    variant="link"
                                    className="p-0 text-primary"
                                    onClick={() => alert('Sign up functionality to be implemented')}
                                >
                                    Sign up
                                </Button>
                            </p> */}
                        </CardFooter>
                    </form>
                </Card>
                {/* <Card className="w-full max-w-4xl mx-auto">
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
                </Card> */}
            </div>
        </div>
    )
}

const Header = () => {
    return (
        <div className="fixed top-0 w-full h-[4rem] flex justify-center items-center">
            <div className="w-full max-w-[90rem] h-full px-4 flex items-center gap-4">
                <GraduationCap color="#000000" />
                <h1 className="text-md font-medium">
                    GradLink
                </h1>
            </div>
        </div>
    )
}