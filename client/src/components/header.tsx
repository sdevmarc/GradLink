import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { UserAvatar } from '@/components/user-avatar'
import './index.css'
import { Slash } from "lucide-react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ROUTES } from '@/constants'

export function BreadcrumbWithCustomSeparator() {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

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
            {/* <HeaderDashboard /> */}
            <Outlet />
        </>
    )
}

export const HomeHeaderLayout = () => {
    return (
        <>
            <Outlet />
        </>
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

export const HeaderDashboard = () => {
    const location = useLocation()
    return (
        <>
            <header className="hdashboard z-[1]  backdrop-blur-[1rem] backdrop-saturate-50 fixed top-0 left-0 w-full h-[6rem] border-b-[0.7px] border-black/20 flex justify-center items-center">
                <div className="w-full h-full max-w-[90rem] px-4 flex flex-col justify-center items-center">
                    <div className="w-full h-[50%] flex justify-between items-center pl-4">
                        {
                            (() => {
                                const key = location.pathname;

                                switch (key) {
                                    case ROUTES.OVERVIEW:
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
                                        )
                                    case ROUTES.CURRENTLY_ENROLLED:
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
                                            </BreadCrumbs>
                                        )
                                    case ROUTES.LIST_OF_STUDENTS:
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
                                        )
                                    case ROUTES.ALUMNI_GRADUATES:
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
                                        )
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
                                    case ROUTES.AVAILABLE_PROGRAMS:
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
                                        )
                                    case ROUTES.AVAILABLE_COURSES:
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
    return (
        <div></div>
    )
}