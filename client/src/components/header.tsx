import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { UserAvatar } from '@/components/user-avatar'
import './index.css'
import { House, Slash } from "lucide-react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ROUTES } from '@/constants'
import { Input } from './ui/input'
import { Button } from './ui/button'
// import { Button } from './ui/button'

// export function BreadcrumbWithCustomSeparator() {
//     return (
//         <Breadcrumb>
//             <BreadcrumbList>
//                 <BreadcrumbItem>
//                     <BreadcrumbLink href="/">Home</BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator>
//                     <Slash />
//                 </BreadcrumbSeparator>
//                 <BreadcrumbItem>
//                     <BreadcrumbLink href="/components">Components</BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator>
//                     <Slash />
//                 </BreadcrumbSeparator>
//                 <BreadcrumbItem>
//                     <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
//                 </BreadcrumbItem>
//             </BreadcrumbList>
//         </Breadcrumb>
//     )
// }

export const HeaderLayout = () => {
    return (
        <>
            <HeaderDashboard />
            <Outlet />
        </>
    )
}

export const TracerHeaderLayout = () => {
    return (
        <>
            <HeaderTracer />
            <Outlet />
        </>
    )
}

export const HomeHeaderLayout = () => {
    return (
        <Outlet />
    )
}

const BreadCrumbs = ({ children }: { children: React.ReactNode }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {children}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

const HeaderDashboard = () => {
    const location = useLocation()
    const { sid } = useParams()
    return (
        <>
            <header className="hdashboard z-[1] backdrop-blur-[1rem] backdrop-saturate-50 fixed top-0 left-0 w-full h-[6rem] border-b-[0.7px] border-black/20 flex justify-center items-center">
                <div className="w-full h-full max-w-[90rem] px-4 flex flex-col justify-center items-center">
                    <div className="w-full h-[50%] flex justify-between items-center pl-4">
                        {
                            (() => {
                                const key = location.pathname;

                                switch (key) {
                                    case ROUTES.OVERVIEW:
                                    case ROUTES.CURRENTLY_ENROLLED:
                                    case ROUTES.LIST_OF_STUDENTS:
                                    case ROUTES.ALUMNI_GRADUATES:
                                    case ROUTES.CURRICULUM:
                                    case ROUTES.AVAILABLE_PROGRAMS:
                                    case ROUTES.AVAILABLE_COURSES:
                                    case ROUTES.GOOGLE_FORM:
                                    case `/student/details/${sid}`:
                                    case `/student/evaluation/${sid}`:
                                        return (
                                            <BreadCrumbs>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md'>LOGO</BreadcrumbPage>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator>
                                                    <Slash />
                                                </BreadcrumbSeparator>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md font-medium'>Gradlink</BreadcrumbPage>
                                                </BreadcrumbItem>
                                            </BreadCrumbs>
                                        );
                                    case ROUTES.CREATE_STUDENT:
                                        return (
                                            <BreadCrumbs>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md'>LOGO</BreadcrumbPage>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator>
                                                    <Slash />
                                                </BreadcrumbSeparator>
                                                <BreadcrumbItem>
                                                    <BreadcrumbItem className='text-md font-light'>Gradlink</BreadcrumbItem>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator>
                                                    <Slash />
                                                </BreadcrumbSeparator>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md font-medium'>
                                                        Enroll a student
                                                    </BreadcrumbPage>
                                                </BreadcrumbItem>
                                            </BreadCrumbs>
                                        )
                                    case ROUTES.CREATE_COURSE:
                                        return (
                                            <BreadCrumbs>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md'>LOGO</BreadcrumbPage>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator>
                                                    <Slash />
                                                </BreadcrumbSeparator>
                                                <BreadcrumbItem>
                                                    <BreadcrumbItem className='text-md font-light'>Gradlink</BreadcrumbItem>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator>
                                                    <Slash />
                                                </BreadcrumbSeparator>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md font-medium'>
                                                        Create a course
                                                    </BreadcrumbPage>
                                                </BreadcrumbItem>
                                            </BreadCrumbs>
                                        )
                                    case ROUTES.CREATE_PROGRAM:
                                        return (
                                            <BreadCrumbs>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md'>LOGO</BreadcrumbPage>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator>
                                                    <Slash />
                                                </BreadcrumbSeparator>
                                                <BreadcrumbItem>
                                                    <BreadcrumbItem className='text-md font-light'>Gradlink</BreadcrumbItem>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator>
                                                    <Slash />
                                                </BreadcrumbSeparator>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md font-medium'>
                                                        Create a program
                                                    </BreadcrumbPage>
                                                </BreadcrumbItem>
                                            </BreadCrumbs>
                                        )
                                    default:
                                        return null;
                                }
                            })()
                        }
                        {/* <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">
                                        LOGO
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <Slash />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <Slash />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb> */}
                        {/* <h1 className='text-[.8rem] text-text font-normal px-4'>
                        LOGO
                        </h1> */}
                        <div className="flex items-center gap-4">
                            <h1 className='text-text font-normal rounded-full px-3 py-1 text-[.8rem]'>
                                Welcome, John Doe
                            </h1>
                            <UserAvatar image='https://github.com/shadcn.png' initials='CN' />
                        </div>
                    </div>
                    <div className="w-full h-[30%] flex justify-start items-center">
                        <nav className="flex items-center gap-1">
                            <NavLink to={`/overview`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                Overview
                            </NavLink>
                            <NavLink to={`/tracer`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                Tracer
                            </NavLink>
                            <NavLink to={`/student`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                Student
                            </NavLink>
                            <NavLink to={`/program`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                Program
                            </NavLink>
                            <NavLink to={`/form`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                Google Form
                            </NavLink>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}


export const HeaderTracer = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className="z-[1] fixed top-0 left-0 w-full h-[4rem] flex justify-center items-center">
                <header className="w-full max-w-[90rem] h-full flex justify-between items-center px-4">
                    <form className="flex items-center gap-2">
                        <div onClick={() => navigate(ROUTES.OVERVIEW)} className="px-2 py-2 bg-background rounded-lg cursor-pointer hover:bg-muted duration-200">
                            <House color='#000000' size={20} />
                        </div>

                        <Input placeholder='Search keywords...' className='w-[20rem] bg-background' required />
                        <Button variant={`outline`} size={`sm`} type='submit'>
                            Filter
                        </Button>
                    </form>
                    <div className="flex items-center gap-4">
                        <h1 className='text-text font-normal rounded-full px-3 py-1 text-[.8rem]'>
                            Welcome, John Doe
                        </h1>
                        <UserAvatar image='https://github.com/shadcn.png' initials='CN' />
                    </div>
                </header>
            </div>
        </>
    )
}