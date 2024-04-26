import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { BarChart } from '@mui/x-charts/BarChart'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useNavigate } from 'react-router-dom'

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
                        <div className="w-full flex items-center gap-3">
                            <button
                                onClick={handleBack}
                                className='px-[1rem] py-[.5rem] rounded-lg border border-solid flex items-center'
                            >
                                <ArrowBackIosIcon /> Back
                            </button>
                            <h1
                                className='font-[600]'
                            >
                                ATTRITION RATE
                            </h1>
                        </div>

                        <div className="w-full h-full flex justify-start items-start gap-5">
                            <div className="w-full h-[50%] flex justify-between items-center ">
                                <div className="w-[50%] h-full flex justify-center items-center">
                                    <BarChart
                                        xAxis={[{ scaleType: 'band', data: ['First Semester', 'Second Semester', 'Midyear'] }]}
                                        series={[
                                            { data: [4, 3, 5] },
                                            { data: [1, 6, 3] },
                                            { data: [2, 5, 6] },
                                            { data: [2, 5, 6] }
                                        ]}
                                        width={500}
                                        height={300}
                                    />
                                </div>
                                <div className="w-[50%] h-full flex flex-col justify-start items-start ">
                                    <div className="w-full h-full flex flex-col">
                                        <h1
                                            className='font-bold'
                                        >
                                            FIRST SEMESTER
                                        </h1>
                                        <div className="w-full flex flex-col px-[1rem]">
                                            <h1
                                                className='font-[600]'
                                            >
                                                Master in Information Technology: 24
                                            </h1>
                                            <h1
                                                className='font-[600]'
                                            >
                                                Master in Software Engineering: 24
                                            </h1>
                                            <h1
                                                className='font-[600]'
                                            >
                                                Master Chef: 24
                                            </h1>
                                        </div>
                                    </div>

                                    <div className="w-full h-full flex flex-col">
                                        <h1
                                            className='font-bold'
                                        >
                                            SECOND SEMESTER
                                        </h1>
                                        <div className="w-full flex flex-col px-[1rem]">
                                            <h1
                                                className='font-[600]'
                                            >
                                                Master in Information Technology: 24
                                            </h1>
                                            <h1
                                                className='font-[600]'
                                            >
                                                Master in Software Engineering: 24
                                            </h1>
                                            <h1
                                                className='font-[600]'
                                            >
                                                Master Chef: 24
                                            </h1>
                                        </div>
                                    </div>

                                    <div className="w-full h-full flex flex-col">
                                        <h1
                                            className='font-bold'
                                        >
                                            MIDYEAR
                                        </h1>
                                        <div className="w-full flex flex-col px-[1rem]">
                                            <h1
                                                className='font-[600]'
                                            >
                                                Master in Information Technology: 24
                                            </h1>
                                            <h1
                                                className='font-[600]'
                                            >
                                                Master in Software Engineering: 24
                                            </h1>
                                            <h1
                                                className='font-[600]'
                                            >
                                                Master Chef: 24
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
