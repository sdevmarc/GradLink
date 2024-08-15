import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>
            <main className="w-full h-screen flex justify-center items-center">
                <Link to='/dashboard'>
                    Dashboard
                </Link>
            </main>
        </>
    )
}
