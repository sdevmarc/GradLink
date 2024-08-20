import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"

export default function Home() {
    const navigate = useNavigate()

    const HandleSubmit = () => {
        navigate('/dashboard')
    }
    return (
        <div className="w-full h-screen flex">
            <form onSubmit={HandleSubmit} className="w-[40%] h-full bg-background flex flex-col justify-center items-center">
                <div className="w-full max-w-[70%] h-full flex flex-col justify-center items-center gap-4">
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
                            className="placeholder:text-black/60 border border-black/20"
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
            <aside className="w[60%] h-full bg-black">
                <img
                    src="https://plus.unsplash.com/premium_photo-1682974406959-7f7202c932b0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Sample bg"
                    className="w-full h-full object-cover"
                />
            </aside>
        </div >
    )
}
