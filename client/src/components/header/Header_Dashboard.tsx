import { NavLink } from 'react-router-dom'
import { UserAvatar } from '@/components/UserAvatar'
import './index.css'

export default function Header_Dashboard() {
    return (
        <>
            <header className="hdashboard z-[1] backdrop-blur-[1rem] backdrop-saturate-50 fixed top-0 left-0 w-full h-[3.7rem] border-b-[0.7px] border-black/20 flex justify-center items-center">
                <div className="w-full max-w-[90rem] h-full flex justify-between items-center px-8">
                    <nav className="flex items-center gap-2">
                        <h1 className='text-[.8rem] text-text font-normal px-4'>
                            LOGO
                        </h1>
                        <NavLink to={`/mail`} className='text-[.8rem] text-text font-normal'>
                            Mail
                        </NavLink>
                        <NavLink to={`/dashboard`} className='text-[.8rem] text-text font-normal'>
                            Dashboard
                        </NavLink>
                        <NavLink to={`/tracer`} className='text-[.8rem] text-text font-normal'>
                            Tracer
                        </NavLink>
                        <NavLink to={`/alumni`} className='text-[.8rem] text-text font-normal'>
                            Alumni
                        </NavLink>
                        <NavLink to={`/student`} className='text-[.8rem] text-text font-normal'>
                            Student
                        </NavLink>
                        <NavLink to={`/program`} className='text-[.8rem] text-text font-normal'>
                            Program
                        </NavLink>
                        <NavLink to={`/form`} className='text-[.8rem] text-text font-normal'>
                            Form
                        </NavLink>
                    </nav>
                    <nav className="flex items-center gap-4">
                        <h1 className='text-text font-normal text-[.8rem]'>
                            Welcome, John Doe
                        </h1>
                        <UserAvatar image='https://github.com/shadcn.png' initials='CN' />
                    </nav>
                </div>

            </header>
        </>
    )
}
