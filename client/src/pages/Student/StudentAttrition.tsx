import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

export default function GraduateStudies() {
    const [isSidebar, setSidebar] = useState<boolean>(false)

    const toggleSidebar = (value: boolean): void => {
        if (value) {
            setSidebar(true)
        } else {
            setSidebar(false)
        }
    }
    return (
        <>
            <div className="flex flex-col">
                <Navbar onSelectSidebar={(item) => toggleSidebar(item)} />
                <div className="flex">
                    <Sidebar SidebarStatus={isSidebar} />
                    <div className={`${isSidebar ? 'w-[100%]' : 'w-[82.5%]'} h-[93vh] p-[1rem] flex flex-col gap-2`}>
                        <div className="w-full h-[5%] flex justify-start items-center">
                            <h1
                                className='font-[600]'
                            >
                                STUDENT ATTRITION
                            </h1>
                        </div>

                        <div className="w-full h-[95%] flex justify-start items-start gap-5">
                            <Link
                                to='/studentattrition/attritionrate'
                                className="w-[20rem] h-[9rem] border border-solid rounded-lg flex flex-col justify-end items-end p-[1rem]">
                                <h1
                                    className='font-[600]'
                                >
                                    Attrition Rate
                                </h1>
                            </Link>

                            <Link
                                to='/'
                                className="w-[20rem] h-[9rem] border border-solid rounded-lg flex flex-col justify-end items-end p-[1rem]">
                                <h1
                                    className='font-[600]'
                                >
                                    Manage Students
                                </h1>
                            </Link>

                            <Link
                                to='/'
                                className="w-[20rem] h-[9rem] border border-solid rounded-lg flex flex-col justify-end items-end p-[1rem]">
                                <h1
                                    className='font-[600]'
                                >
                                    Manage Courses
                                </h1>
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
