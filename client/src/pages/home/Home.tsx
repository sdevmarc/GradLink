import { ROUTES } from "@/constants"
import { Link } from "react-router-dom"

export default function Home() {

    return (
        <main className="w-full h-screen flex justify-center items-center bg-background">
            <div className="w-full h-full max-w-[90rem] flex flex-col justify-center items-center gap-4">
                <div className="w-full max-w-lg flex flex-col gap-2 items-center">
                    <h1 className="text-[2rem] font-semibold">
                        Gradlink
                    </h1>
                    <p className="text-center">Alumni Tracer and Record Management System for the School of Graduate Studies of Saint Mary’s University</p>
                </div>
                <Link to={ROUTES.LOGIN} className="bg-foreground px-8 py-2 text-primary-foreground hover:bg-black/80">
                    Log In
                </Link>
            </div>
        </main >
    )
}
