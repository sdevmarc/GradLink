import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
    return (
        <>
            <div className="w-[17.5%] h-screen bg-black">
                <Link
                    className='text-white'
                >
                    Dashboard
                </Link>
            </div>
        </>
    )
}
