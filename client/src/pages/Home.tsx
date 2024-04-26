import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()

    const DashboardHandler = () => {
        navigate('/dashboard')
    }

    return (
        <>
            <div className="w-full h-screen flex justify-center items-center">
                <button
                className='border border-black px-[1rem]'
                    onClick={DashboardHandler}
                >
                    Go to Dashboard
                </button>
            </div>

        </>
    )
}
