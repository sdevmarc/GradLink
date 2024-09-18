import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants"
import React from "react"
import { Link, useNavigate } from "react-router-dom"

export default function LoginPage() {
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        navigate(ROUTES.OVERVIEW)
    }

    return (
        <div className="w-full h-screen flex flex-col items-center">
            <Header />
            <form onSubmit={handleSubmit} className="w-full max-w-[90rem] h-full bg-background flex flex-col justify-center items-center px-4">
                <div className="w-full max-w-[35rem] h-full flex justify-center items-center flex-col gap-4 px-4">
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="text-3xl font-bold">
                            Login
                        </h1>
                        <p className="text-balance text-text text-sm">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <div className="w-full flex flex-col gap-1">
                        <div className="flex justify-between">
                            <h1 className="text-text font-medium text-md">
                                Email
                            </h1>
                        </div>
                        <Input
                            type="email"
                            placeholder="m@example.com"
                            className=""
                            required
                        />
                    </div>
                    <div className="w-full flex flex-col gap-1">
                        <div className="flex justify-between">
                            <h1 className="text-text font-medium text-md">
                                Password
                            </h1>
                            <Link to={`/`} className="text-text text-sm font-semibold underline">
                                Forgot your password?
                            </Link>
                        </div>
                        <Input
                            type="password"
                            className="placeholder:text-black/60 border border-black/20"
                            required
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </div>
                </div>
            </form >
        </div >
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
                <h1>Logo</h1>
                <Button onClick={handleGoBack} variant={`outline`} size={`sm`}>
                    Go back
                </Button>
            </div>
        </div>
    )
}