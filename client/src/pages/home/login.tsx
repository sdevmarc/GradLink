import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants"
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { EyeOff, Eye, Loader2, CircleCheck, CircleX } from 'lucide-react'
import SMU from '@/assets/SMU Main Emblem - For dark color backgrounds.png'
import SOGS from '@/assets/SMU Unit Emblem - SoGS 1by1.png'
import Loading from "@/components/loading"
import { AuthContext } from "@/hooks/AuthContext"
import { useMutation } from "@tanstack/react-query"
import { API_USER_CHANGE_FORGOT_PASSWORD, API_USER_LOGIN } from "@/api/user"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { InputOTPForm } from "@/components/otp"
import { API_SETTINGS_SEND_OTP } from "@/api/settings"
import GradlinkLogoBlack from '@/assets/gradlink-logo-black.svg'
import GradlinkLogoWhite from '@/assets/gradlink-logo-white.svg'
import { useTheme } from "@/hooks/useTheme"

export default function LoginPage() {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const [isImageLoading, setImageLoading] = useState({ smu: true, sogs: true })
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState<string>('')
    const [confirmpassword, setConfirmPassword] = useState<string>('')
    const [isverified, setisverified] = useState<boolean>(false)
    const [isverifying, setisverifying] = useState<boolean>(false)
    const [isOtp, setOtp] = useState<boolean>(false)
    const [dialogforgotpassword, setDialogForgotPassword] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const navigate = useNavigate()
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })

    useEffect(() => {
        if (isAuthenticated) {
            // Redirect to overview page if authenticated
            navigate("/overview", { replace: true });
        }
    }, [isAuthenticated, navigate])

    const { mutateAsync: userlogin, isPending: userloginPending } = useMutation({
        mutationFn: API_USER_LOGIN,
        onSuccess: async (data) => {
            if (!data.success) {
                setIsAuthenticated(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                return
            } else {
                setIsAuthenticated(true)
                navigate(ROUTES.OVERVIEW)
                return
            }
        },
        onError: (data) => {
            setIsAuthenticated(false)
            setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
            return
        }
    })

    const { mutateAsync: sendotp, isPending: sendotpPending } = useMutation({
        mutationFn: API_SETTINGS_SEND_OTP,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogForgotPassword(false)
                setOtp(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                return
            } else {
                setDialogForgotPassword(false)
                setOtp(true)
                return
            }
        },
        onError: (data) => {
            setDialogForgotPassword(false)
            setOtp(false)
            setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
            return
        }
    })

    const { mutateAsync: changepassword, isPending: changepasswordPending } = useMutation({
        mutationFn: API_USER_CHANGE_FORGOT_PASSWORD,
        onSuccess: async (data) => {
            if (!data.success) {
                setOtp(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                return
            } else {
                setPassword('')
                setConfirmPassword('')
                setisverified(false)
                setOtp(false)
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                return
            }
        },
        onError: (data) => {
            setOtp(false)
            setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
            return
        }
    })

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const nospaceemail = (email ?? '').replace(/\s+/g, '').toLowerCase()
        if (nospaceemail === '' || !password) return

        await userlogin({ email, password })
    }

    const handleForgotPassword = async () => {
        const nospaceEmail = (email ?? '').replace(/\s+/g, '').toLowerCase()

        if (nospaceEmail === '') {
            setDialogForgotPassword(false)
            setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: 'Email is required, please fill-in the required field.' })
            return
        }
        await sendotp({ email })
        return
    }
    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const nospaceNewPassword = (password ?? '').replace(/\s+/g, '').toLowerCase()
        const nospaceConfirmPassword = (confirmpassword ?? '').replace(/\s+/g, '').toLowerCase()

        if (nospaceNewPassword === '' || nospaceConfirmPassword === '') {
            setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: 'Please fill-in the required field.' })
            return
        }

        if (nospaceNewPassword !== nospaceConfirmPassword) {
            setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: 'Password do not match!' })
            return
        }

        await changepassword({ email, password })
        return
    }

    const isLoading = isImageLoading.smu || isImageLoading.sogs || userloginPending || isverifying || changepasswordPending

    return (
        <>
            {isLoading && <Loading />}
            <AlertDialogConfirmation
                btnTitle='Continue'
                className='w-full py-4'
                isDialog={alertdialogstate.show}
                setDialog={(open) => setAlertDialogState(prev => ({ ...prev, show: open }))}
                type={`alert`}
                title={alertdialogstate.title}
                description={alertdialogstate.description}
                icon={alertdialogstate.success ? <CircleCheck color="#42a626" size={70} /> : <CircleX color="#880808" size={70} />}
                variant={`default`}
                btnContinue={() => setAlertDialogState(prev => ({ ...prev, show: false }))}
            />

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
                    {
                        isverified &&
                        <Card className={`w-full max-w-md`}>
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">GradLink</CardTitle>
                                <CardDescription>Enter your new password to change your password</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleChangePassword}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newpassword">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                disabled={isLoading}
                                                id="newpassword"
                                                type={showNewPassword ? "text" : "password"}
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
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmpassword">Confirm Password</Label>
                                        <div className="relative">
                                            <Input
                                                disabled={isLoading}
                                                id="confirmpassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmpassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <Button
                                                disabled={isLoading}
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col space-y-4">
                                    <Button
                                        disabled={isLoading}
                                        className="w-full"
                                        type="submit">
                                        {
                                            isLoading ? (
                                                <span className="flex items-center gap-4">
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />  Changing password...
                                                </span>
                                            ) : 'Change Password'
                                        }
                                    </Button>
                                    <Button onClick={() => {
                                        setisverified(false)
                                        setPassword('')
                                        setConfirmPassword('')
                                        setOtp(false)
                                    }}
                                        variant={`ghost`} type="button"
                                        className="w-full"
                                    >
                                        Cancel
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    }
                    {
                        (!isverified && isOtp) &&
                        <div className="flex items-center justify-center">
                            <InputOTPForm
                                iscancel={(e: boolean) => setOtp(e)}
                                isLoading={(e: boolean) => setisverifying(e)}
                                isverified={(e: boolean) => {
                                    setisverified(e)
                                    setOtp(false)
                                }}
                                message={(e: string) => !isverified &&
                                    setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: e }
                                    )}
                            />
                        </div>
                    }
                    {
                        (!isverified && !isOtp) &&
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
                                            <AlertDialogConfirmation
                                                isDialog={dialogforgotpassword}
                                                setDialog={(open) => setDialogForgotPassword(open)}
                                                type={`default`}
                                                disabled={sendotpPending}
                                                className=''
                                                variant={'ghost'}
                                                btnTitle="Forgot Password"
                                                title="Are you sure?"
                                                description={`This will send a one-time-password to reset your password to your email.`}
                                                btnContinue={handleForgotPassword}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Input
                                                disabled={isLoading}
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                placeholder="Password"
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
                    }
                </div>
            </div>
        </>
    )
}

const Header = () => {
    const { theme } = useTheme()

    return (
        <div className="fixed top-0 w-full h-[4rem] flex justify-center items-center">
            <div className="w-full max-w-[90rem] h-full px-4 flex items-center gap-4">
                {
                    theme === 'light' ?
                        <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                            <img src={GradlinkLogoBlack} alt="" className='w-full h-full object-contain' />
                        </div>
                        :
                        <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                            <img src={GradlinkLogoWhite} alt="" className='w-full h-full object-contain' />
                        </div>
                }
                <h1 className="text-md font-medium">
                    GradLink
                </h1>
            </div>
        </div>
    )
}