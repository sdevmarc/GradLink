import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { GraduationCap, EyeOff, Eye, Loader2 } from 'lucide-react'
import SMU from '@/assets/SMU Main Emblem - For dark color backgrounds.png'
import SOGS from '@/assets/SMU Unit Emblem - SoGS 1by1.png'
import Loading from "@/components/loading"
export default function LoginPage() {
    const [isImageLoading, setImageLoading] = useState({ smu: true, sogs: true })
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        navigate(ROUTES.OVERVIEW)
    }

    const isLoading = isImageLoading.smu || isImageLoading.sogs

    return (
        <>
            {isLoading && <Loading />}
            <div className="w-full flex flex-col">
                <Header />
                <div className="min-h-screen flex flex-col items-center justify-evenly p-4">
                    <div className="flex items-center gap-8 relative">
                        <img
                            loading="lazy"
                            src={SMU}
                            alt="SMU Logo"
                            className={`w-[10rem] h-[10rem]`}
                            onLoad={() => setImageLoading(prev => ({ ...prev, smu: false }))}
                            onError={() => setImageLoading(prev => ({ ...prev, smu: false }))}
                        />
                        <img
                            loading="lazy"
                            src={SOGS}
                            alt="SOGS Logo"
                            className={`w-[10rem] h-[10rem]`}
                            onLoad={() => setImageLoading(prev => ({ ...prev, sogs: false }))}
                            onError={() => setImageLoading(prev => ({ ...prev, sogs: false }))}
                        />
                    </div>

                    <Card className={`w-full max-w-md`}>
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
                                        disabled={isLoading}
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
                                            disabled={isLoading}
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
                                            disabled={isLoading}
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <Button
                                            disabled={isLoading}
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
                                <Button
                                    disabled={isLoading}
                                    className="w-full"
                                    type="submit">
                                    {
                                        isLoading ? (
                                            <span className="flex items-center gap-4">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />  Logging in...
                                            </span>
                                        ) : 'Login'
                                    }



                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    )
}

const Header = () => {
    return (
        <div className="fixed top-0 w-full h-[4rem] flex justify-center items-center">
            <div className="w-full max-w-[90rem] h-full px-4 flex items-center gap-4">
                <GraduationCap className="text-primary" />
                <h1 className="text-md font-medium">
                    GradLink
                </h1>
            </div>
        </div>
    )
}