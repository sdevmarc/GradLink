import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { UserAvatar } from '@/components/user-avatar'
import './index.css'
import { CircleUser, House, Slash } from "lucide-react"
import GradlinkLogoBlack from '@/assets/gradlink-logo-black.svg'
import GradlinkLogoWhite from '@/assets/gradlink-logo-white.svg'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ROUTES } from '@/constants'
import { Input } from './ui/input'
import { useEffect, useState } from 'react'
import { Combobox } from './combobox'
import { useQuery } from '@tanstack/react-query'
import { API_PROGRAM_FINDALL } from '@/api/program'
import { IAPIPrograms } from '@/interface/program.interface'
import { CalendarDatePicker } from './calendar-date-picker'
import { LeftSheetModal } from './left-sheet-modal'
import { API_USER_GET_USER } from '@/api/user'
import { Skeleton } from './ui/skeleton'
import { useTheme } from '@/hooks/useTheme'
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

export const HomeHeaderLayout = () => {
    return (
        <Outlet />
    )
}

export const SettingsLayout = () => {
    return (
        <>
            <HeaderSettings />
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

const HeaderSettings = () => {
    const { theme } = useTheme()

    const { data: userdata, isLoading: userdataLoading, isFetched: userdataFetched } = useQuery({
        queryFn: () => API_USER_GET_USER(),
        queryKey: ['users']
    })

    return (
        <header className="hdashboard z-[1] backdrop-blur-[1rem] backdrop-saturate-50 fixed top-0 left-0 w-full h-[6rem] border-b-[0.7px] border-black/20 flex justify-center items-center">
            <div className="w-full h-full max-w-[90rem] px-4 flex flex-col justify-center items-center">
                <div className="w-full h-[50%] flex justify-between items-center pl-4">
                    {
                        (() => {
                            const key = location.pathname;

                            switch (key) {
                                case ROUTES.OVERVIEW:
                                case ROUTES.AUDIT_LOG:
                                case ROUTES.GENERAL_SETTINGS:
                                    return (
                                        <BreadCrumbs>
                                            <BreadcrumbItem>
                                                <BreadcrumbPage className='text-md'>
                                                    {
                                                        theme === 'light' ?
                                                            <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                <img src={GradlinkLogoBlack} alt="" className='w-full h-full object-contain' />
                                                            </div>
                                                            :
                                                            <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                <img src={GradlinkLogoWhite} alt="" className='w-full h-full object-contain' />
                                                            </div>
                                                    }
                                                </BreadcrumbPage>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator>
                                                <Slash />
                                            </BreadcrumbSeparator>
                                            <BreadcrumbItem>
                                                <BreadcrumbPage className='text-md font-medium flex items-center gap-2'>
                                                    <CircleUser className='text-primary' size={18} />   My Account
                                                </BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </BreadCrumbs>
                                    );
                                default:
                                    return (
                                        <BreadCrumbs>
                                            <BreadcrumbItem>
                                                <BreadcrumbPage className='text-md'>
                                                    {
                                                        theme === 'light' ?
                                                            <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                <img src={GradlinkLogoBlack} alt="" className='w-full h-full object-contain' />
                                                            </div>
                                                            :
                                                            <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                <img src={GradlinkLogoWhite} alt="" className='w-full h-full object-contain' />
                                                            </div>
                                                    }
                                                </BreadcrumbPage>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator>
                                                <Slash />
                                            </BreadcrumbSeparator>
                                            <BreadcrumbItem>
                                                <BreadcrumbPage className='text-md font-medium flex items-center gap-2'>
                                                    <CircleUser className='text-primary' size={18} />   My Account
                                                </BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </BreadCrumbs>
                                    )
                            }
                        })()}
                    <div className="flex items-center gap-4">
                        <h1 className='text-text font-normal rounded-full px-3 py-1 text-[.8rem]'>
                            {
                                userdataLoading ? <Skeleton className="h-[1rem] w-[10rem]" />
                                    : `Welcome, ${userdata?.data?.name || 'Guest'}`
                            }
                        </h1>
                        <UserAvatar />
                    </div>
                </div>
                {
                    userdataFetched &&
                    <div className="w-full h-[30%] flex justify-start items-center">
                        <nav className="flex items-center gap-1">
                            <NavLink to={ROUTES.OVERVIEW} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                Overview
                            </NavLink>
                            {
                                (userdata?.data?.role === 'root' || userdata?.data?.role === 'admin') &&
                                <NavLink to={ROUTES.AUDIT_LOG} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                    Audit Log
                                </NavLink>

                            }
                            <NavLink to={ROUTES.GENERAL_SETTINGS} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                Settings
                            </NavLink>
                        </nav>
                    </div>
                }
            </div>
        </header>
    )
}

const HeaderDashboard = () => {
    const [coursename, setCoursesName] = useState<string>('')
    const [academicYear, setAcademicYear] = useState<string>('')
    const location = useLocation()
    const { sid, id } = useParams()
    const { theme } = useTheme()

    const { data: userdata, isLoading: userdataLoading, isFetched: userdataFetched } = useQuery({
        queryFn: () => API_USER_GET_USER(),
        queryKey: ['users']
    })

    useEffect(() => {
        if (id) {
            const jsonString = atob(id);
            const parsedObject = JSON.parse(jsonString);
            setCoursesName(parsedObject?.descriptiveTitle)
            setAcademicYear(parsedObject?.academicYear)
        }
    }, [id])

    return (
        <>
            <header className="hdashboard z-[1] backdrop-blur-[1rem] backdrop-saturate-50 fixed top-0 left-0 w-full h-[6rem] border-b-[0.7px] border-black/20 flex justify-center items-center">
                <div className="w-full h-full max-w-[90rem] px-4 flex flex-col justify-center items-center">
                    <div className="w-full h-[50%] flex justify-between items-center pl-4">
                        {
                            userdataFetched &&
                            (() => {
                                const key = location.pathname;

                                switch (key) {
                                    case ROUTES.OVERVIEW:
                                    case ROUTES.LIST_OF_STUDENTS:
                                    case ROUTES.PROGRAMS:
                                    case ROUTES.GOOGLE_FORM:
                                    case ROUTES.ENROLLMENT:
                                    case ROUTES.ENROLLMENT_ATTRITION_RATE_COURSES:
                                    case ROUTES.ENROLLMENT_ATTRITION_RATE_PROGRAMS:
                                    case ROUTES.ENROLLMENT_ARCHIVED_ACADEMIC_YEAR_OFFERED_COURSES:
                                    case ROUTES.ALUMNI:
                                    case ROUTES.TRACER_MAP:
                                    case ROUTES.ALUMNI_REJECTS:
                                    case ROUTES.ALUMNI_TRASH:
                                    case `/student/details/${sid}`:
                                    case `/student/evaluation/${sid}`:
                                        return (
                                            <BreadCrumbs>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md'>
                                                        {
                                                            theme === 'light' ?
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoBlack} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                                :
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoWhite} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                        }
                                                    </BreadcrumbPage>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator>
                                                    <Slash />
                                                </BreadcrumbSeparator>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md font-medium'>Gradlink</BreadcrumbPage>
                                                </BreadcrumbItem>
                                            </BreadCrumbs>
                                        );
                                    case ROUTES.CREATE_COURSE_OFFERED:
                                        return (
                                            <BreadCrumbs>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md'>
                                                        {
                                                            theme === 'light' ?
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoBlack} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                                :
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoWhite} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                        }
                                                    </BreadcrumbPage>
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
                                                        Create offered courses
                                                    </BreadcrumbPage>
                                                </BreadcrumbItem>
                                            </BreadCrumbs>
                                        )
                                    case ROUTES.UPDATE_COURSE_OFFERED:
                                        return (
                                            <BreadCrumbs>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md'>
                                                        {
                                                            theme === 'light' ?
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoBlack} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                                :
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoWhite} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                        }
                                                    </BreadcrumbPage>
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
                                                        Update offered courses
                                                    </BreadcrumbPage>
                                                </BreadcrumbItem>
                                            </BreadCrumbs>
                                        )
                                    case ROUTES.NEW_STUDENT:
                                        return (
                                            <BreadCrumbs>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md'>
                                                        {
                                                            theme === 'light' ?
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoBlack} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                                :
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoWhite} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                        }
                                                    </BreadcrumbPage>
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
                                                        Create a student
                                                    </BreadcrumbPage>
                                                </BreadcrumbItem>
                                            </BreadCrumbs>
                                        )
                                    case `/enrollment/archived-semesters-in-academic-year/${id}`:
                                        return (
                                            <BreadCrumbs>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md'>
                                                        {
                                                            theme === 'light' ?
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoBlack} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                                :
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoWhite} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                        }
                                                    </BreadcrumbPage>
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
                                                    <BreadcrumbPage className='text-md font-medium capitalize'>
                                                        {academicYear}
                                                    </BreadcrumbPage>
                                                </BreadcrumbItem>
                                            </BreadCrumbs>
                                        )
                                    case `/enrollment/enroll-student/${id}`:
                                        return (
                                            <BreadCrumbs>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md'>
                                                        {
                                                            theme === 'light' ?
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoBlack} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                                :
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoWhite} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                        }
                                                    </BreadcrumbPage>
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
                                                    <BreadcrumbPage className='text-md font-medium capitalize'>
                                                        {coursename}
                                                    </BreadcrumbPage>
                                                </BreadcrumbItem>
                                            </BreadCrumbs>
                                        )
                                    case `/enrollment/evaluate-student/${id}`:
                                        return (
                                            <BreadCrumbs>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md'>
                                                        {
                                                            theme === 'light' ?
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoBlack} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                                :
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoWhite} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                        }
                                                    </BreadcrumbPage>
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
                                                    <BreadcrumbPage className='text-md font-medium capitalize'>
                                                        {coursename}
                                                    </BreadcrumbPage>
                                                </BreadcrumbItem>
                                            </BreadCrumbs>
                                        )
                                    // case `/program/details/${id}`:
                                    //     return (
                                    //         <BreadCrumbs>
                                    //             <BreadcrumbItem>
                                    //                 <BreadcrumbPage className='text-md'>LOGO</BreadcrumbPage>
                                    //             </BreadcrumbItem>
                                    //             <BreadcrumbSeparator>
                                    //                 <Slash />
                                    //             </BreadcrumbSeparator>
                                    //             <BreadcrumbItem>
                                    //                 <BreadcrumbItem className='text-md font-light'>Gradlink</BreadcrumbItem>
                                    //             </BreadcrumbItem>
                                    //             <BreadcrumbSeparator>
                                    //                 <Slash />
                                    //             </BreadcrumbSeparator>
                                    //             <BreadcrumbItem>
                                    //                 <BreadcrumbPage className='text-md font-medium'>
                                    //                     View details
                                    //                 </BreadcrumbPage>
                                    //             </BreadcrumbItem>
                                    //         </BreadCrumbs>
                                    //     )
                                    case ROUTES.CREATE_STUDENT:
                                        return (
                                            <BreadCrumbs>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md'>
                                                        {
                                                            theme === 'light' ?
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoBlack} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                                :
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoWhite} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                        }
                                                    </BreadcrumbPage>
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
                                                    <BreadcrumbPage className='text-md'>
                                                        {
                                                            theme === 'light' ?
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoBlack} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                                :
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoWhite} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                        }
                                                    </BreadcrumbPage>
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
                                                    <BreadcrumbPage className='text-md'>
                                                        {
                                                            theme === 'light' ?
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoBlack} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                                :
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoWhite} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                        }
                                                    </BreadcrumbPage>
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
                                    case ROUTES.CREATE_CURRICULUM:
                                        return (
                                            <BreadCrumbs>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage className='text-md'>
                                                        {
                                                            theme === 'light' ?
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoBlack} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                                :
                                                                <div className="w-[1.7rem] h-[1.7rem] flex items-center justify-center">
                                                                    <img src={GradlinkLogoWhite} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                        }
                                                    </BreadcrumbPage>
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
                                                        New curriculum
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
                                {
                                    userdataLoading ? <Skeleton className="h-[1rem] w-[10rem]" />
                                        : `Welcome, ${userdata?.data?.name || 'Guest'}`
                                }
                            </h1>
                            <UserAvatar />
                        </div>
                    </div>
                    {/* <div className="w-full h-[30%] flex justify-start items-center">
                        <nav className="flex items-center gap-1">
                            <NavLink to={`/overview`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                Overview
                            </NavLink>
                            <NavLink to={`/tracer`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                Tracer
                            </NavLink>
                            <NavLink to={`/program`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                Program
                            </NavLink>
                            <NavLink to={`/enrollment`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                Enrollment
                            </NavLink>
                            <NavLink to={`/student`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                Student
                            </NavLink>
                            <NavLink to={`/alumni`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                Alumni
                            </NavLink>
                             <NavLink to={`/form`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                Google Form
                            </NavLink>
                        </nav>
                    </div> */}
                    <div className="w-full h-[30%] flex justify-start items-center">
                        {
                            userdataFetched &&
                            <>
                                {

                                    <nav className="flex items-center gap-1">
                                        {
                                            (userdata?.data?.role === 'root' || userdata?.data?.role === 'admin' || userdata?.data?.role === 'user') &&
                                            <>
                                                <NavLink to={`/overview`} className='text-[.8rem] text-text font-normal px-3 py-2 active:bg-blue-300'>
                                                    Overview
                                                </NavLink>
                                                <NavLink to={`/student`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                                    Student Information
                                                </NavLink>
                                            </>
                                        }

                                        {
                                            (userdata?.data?.role === 'root' || userdata?.data?.role === 'admin') &&
                                            <NavLink to={`/alumni`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                                Alumni Information
                                            </NavLink>
                                        }
                                        {
                                            (userdata?.data?.role === 'root' || userdata?.data?.role === 'admin' || userdata?.data?.role === 'user') &&
                                            <NavLink to={`/enrollment`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                                Enrollment And Attrition Rate
                                            </NavLink>
                                        }

                                        {
                                            (userdata?.data?.role === 'root' || userdata?.data?.role === 'admin') &&
                                            <NavLink to={`/program`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                                Programs And Curriculum
                                            </NavLink>
                                        }
                                        {
                                            (userdata?.data?.role === 'user') &&
                                            <NavLink to={`/alumni/tracer`} className='text-[.8rem] text-text font-normal px-3 py-2'>
                                                Tracer Map
                                            </NavLink>
                                        }
                                    </nav>
                                }
                            </>
                        }
                    </div>
                </div>
            </header>
        </>
    )
}


export const HeaderTracer = () => {
    const navigate = useNavigate()
    const [filterprogram, setFilterProgram] = useState<string>('')
    const [formattedprogram, setFormattedProgram] = useState([])
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date()
    })
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const { data: userdata, isLoading: userdataLoading } = useQuery({
        queryFn: () => API_USER_GET_USER(),
        queryKey: ['users']
    })

    const handleViewDetails = () => {
        setIsOpen(true)
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
    }
    const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
        setDateRange({ from, to })
        // Filter table data based on selected date range
        // table.getColumn("date")?.setFilterValue([from, to])
    }

    const { data: program, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['programs']
    })

    useEffect(() => {
        if (!programLoading && programFetched) {
            const formatprogram = program.data.map((item: IAPIPrograms) => {
                const { _id, code } = item
                return { value: _id, label: code }
            })

            setFormattedProgram(formatprogram)
        }
    }, [program])

    return (
        <>
            <div className="z-[1] fixed top-0 left-0 w-full h-[4rem] flex justify-center items-center">
                <header className="w-full max-w-[90rem] h-full flex justify-between items-center px-4">
                    <form className="flex items-center gap-2">
                        <div onClick={() => navigate(ROUTES.OVERVIEW)} className="px-2 py-2 bg-background rounded-lg cursor-pointer hover:bg-muted duration-200">
                            <House color='#000000' size={20} />
                        </div>
                        <Input placeholder='Search keywords...' className='w-[25rem] bg-background' required />
                        <div className="w-[25%]">
                            <Combobox
                                className='w-[170px]'
                                lists={formattedprogram || []}
                                placeholder={`Filter Program`}
                                setValue={(item) => {
                                    handleViewDetails()
                                    setFilterProgram(item)
                                }}
                                value={filterprogram || ''}
                            />
                        </div>
                        <div className="w-[25%]">
                            <CalendarDatePicker
                                date={dateRange}
                                onDateSelect={handleDateSelect}
                                className="w-[200px] h-8 hover:bg-white"
                                variant={`outline`}
                            />
                        </div>
                        <LeftSheetModal
                            className="w-[30%]"
                            isOpen={isOpen}
                            onOpenChange={handleOpenChange}
                            title="Student Details"
                            description="View details of the selected student."
                            content={''}
                        />

                    </form>
                    <div className="flex items-center gap-4 bg-primary-foreground px-4 py-1 rounded-md">
                        <h1 className='text-text font-normal rounded-full text-[.8rem]'>
                            {
                                userdataLoading ? <Skeleton className="h-[1rem] w-[10rem]" />
                                    : `Welcome, ${userdata?.data?.name || 'Guest'}`
                            }
                        </h1>
                        <UserAvatar />
                    </div>
                </header>
            </div>
        </>
    )
}