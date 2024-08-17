import { NavLink } from 'react-router-dom'
import { UserAvatar } from '@/components/UserAvatar'
import './index.css'

export default function Header_Dashboard() {
    return (
        <>
            <header className="hdashboard z-[1] backdrop-blur-[1rem] backdrop-saturate-50 fixed top-0 left-0 w-full h-[3.7rem] border-b-[0.7px] border-black/20 flex justify-center items-center">
                <div className="w-full max-w-[90rem] h-full flex justify-between items-center px-8">
                    <nav className="flex items-center gap-2">
                        <h1 className='text-sm text-text font-medium px-4'>
                            LOGO
                        </h1>
                        <NavLink to={`/mail`} className='text-sm text-text font-medium'>
                            Mail
                        </NavLink>
                        <NavLink to={`/dashboard`} className='text-sm text-text font-medium'>
                            Dashboard
                        </NavLink>
                        <NavLink to={`/tracer`} className='text-sm text-text font-medium'>
                            Tracer
                        </NavLink>
                        <NavLink to={`/student`} className='text-sm text-text font-medium'>
                            Student
                        </NavLink>
                        <NavLink to={`/program`} className='text-sm text-text font-medium'>
                            Program
                        </NavLink>
                        <NavLink to={`/form`} className='text-sm text-text font-medium'>
                            Form
                        </NavLink>
                    </nav>
                    <nav className="flex items-center gap-4">
                        <h1 className='text-text font-medium text-sm'>
                            Welcome, John Doe
                        </h1>
                        <UserAvatar image='https://github.com/shadcn.png' initials='CN' />
                    </nav>
                </div>

            </header>
        </>
    )
}
