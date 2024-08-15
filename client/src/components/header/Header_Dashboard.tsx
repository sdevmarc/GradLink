import { Link } from 'react-router-dom'
import { UserAvatar } from '@/components/UserAvatar'

export default function Header_Dashboard() {
    return (
        <>
            <header className="sticky top-0 left-0 w-full h-[60px] bg-background border-[0.7px] border-black/20 flex justify-center items-center">
                <div className="w-full max-w-[90rem] h-full flex justify-between items-center px-8">
                    <nav className="flex justify-center items-center gap-4">
                        <Link to={`/dashboard`} className='text-sm text-text font-medium'>
                            LOGO
                        </Link>
                        <Link to={`/dashboard`} className='text-sm text-text font-medium'>
                            Mail
                        </Link>
                        <Link to={`/dashboard`} className='text-sm text-text font-medium'>
                            Dashboard
                        </Link>
                        <Link to={`/dashboard`} className='text-sm text-text font-medium'>
                            Tracer
                        </Link>
                        <Link to={`/dashboard`} className='text-sm text-text font-medium'>
                            Alumni
                        </Link>
                        <Link to={`/dashboard`} className='text-sm text-text font-medium'>
                            Student
                        </Link>
                        <Link to={`/dashboard`} className='text-sm text-text font-medium'>
                            Program
                        </Link>
                        <Link to={`/dashboard`} className='text-sm text-text font-medium'>
                            Form
                        </Link>
                    </nav>
                    <nav className="h-full flex justify-center items-center gap-4">
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
