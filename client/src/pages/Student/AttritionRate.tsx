import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function AttritionRate() {
    const [isSidebar, setSidebar] = useState<boolean>(false)
    const navigate = useNavigate()

    const toggleSidebar = (value: boolean): void => {
        if (value) {
            setSidebar(true)
        } else {
            setSidebar(false)
        }
    }

    const handleBack = () => {
        navigate(-1)
    }


    return (
        <>
            <div className="flex flex-col">
                <Navbar onSelectSidebar={(item) => toggleSidebar(item)} />
                <div className="flex">
                    <Sidebar SidebarStatus={isSidebar} />
                    <div className={`${isSidebar ? 'w-[100%]' : 'w-[82.5%]'} h-[93vh] p-[1rem] flex flex-col gap-2`}>
                        <div className="w-full h-[5%] flex justify-start items-center gap-1">
                            <button
                                onClick={handleBack}
                                className='bg-white px-[1rem] py-[.5rem] rounded-lg flex items-center'
                            >
                                <ArrowBackIosIcon /> Back
                            </button>
                            <h1
                                className='font-[600]'
                            >
                                ATTRITION RATE
                            </h1>
                        </div>
                        <div className="w-full h-[95%] flex justify-start items-start gap-5">
                            <Link
                                to='/studentattrition/attritionrate/enrollrate'
                                className="w-[20rem] h-[9rem] border border-solid rounded-lg flex flex-col justify-end items-end p-[1rem]">
                                <h1
                                    className='font-[600]'
                                >
                                    Enroll Rate
                                </h1>
                            </Link>

                            <Link
                                to='/studentattrition/attritionrate/survivalrate'
                                className="w-[20rem] h-[9rem] border border-solid rounded-lg flex flex-col justify-end items-end p-[1rem]">
                                <h1
                                    className='font-[600]'
                                >
                                    Survival Rate
                                </h1>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
