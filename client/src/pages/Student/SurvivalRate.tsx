import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useNavigate } from 'react-router-dom'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

export default function SurvivalRate() {
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
                    <div className={`${isSidebar ? 'w-[100%]' : 'w-[82.5%]'} h-[93vh] p-[1rem] flex flex-col`}>
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
                                SURVIVAL RATE
                            </h1>
                        </div>
                        <div className="w-full h-[95%] p-[1rem]">
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 5 },
                                    },
                                }}
                                pageSizeOptions={[5, 10, 15]}
                                checkboxSelection
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'No.', width: 70 },
    { field: 'syear', headerName: 'School Year', width: 200 },
    { field: 'course', headerName: 'Course Name', width: 250 },
    { field: 'first', headerName: 'First Semester', type: 'number', width: 150 },
    { field: 'second', headerName: 'Second Semester', type: 'number', width: 150 },
    { field: 'third', headerName: 'Third Semester', type: 'number', width: 150 },
    { field: 'total', headerName: 'Total', type: 'number', width: 150 }
    // {
    //     field: 'age',
    //     headerName: 'Age',
    //     type: 'number',
    //     width: 90,
    // },
    // {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    // },
]

const rows = [
    { id: 1, syear: '2012', course: 'Master in Data Science', first: 20, second: 15, third: 10, total: 40 },
    { id: 2, syear: '2012', course: 'Ph.D. in Neuroscience', first: 25, second: 20, third: 15, total: 40 },
    { id: 3, syear: '2012', course: 'Master in Business Administration', first: 30, second: 25, third: 20, total: 40 },
    { id: 4, syear: '2012', course: 'Ph.D. in Robotics', first: 18, second: 12, third: 8, total: 40 },
    { id: 5, syear: '2012', course: 'Master in Environmental Engineering', first: 15, second: 10, third: 5, total: 40 },
    { id: 6, syear: '2012', course: 'Ph.D. in Linguistics', first: 22, second: 18, third: 14, total: 40 },
    { id: 7, syear: '2012', course: 'Master in Public Health', first: 35, second: 30, third: 25, total: 40 },
    { id: 8, syear: '2012', course: 'Ph.D. in Astrophysics', first: 16, second: 11, third: 6, total: 40 },
    { id: 9, syear: '2012', course: 'Master in Urban Planning', first: 24, second: 20, third: 16, total: 40 },
    { id: 10, syear: '2012', course: 'Ph.D. in Artificial Intelligence', first: 28, second: 22, third: 18, total: 40 },

    { id: 11, syear: '2012', course: 'Master in Data Science', first: 20, second: 15, third: 10, total: 40 },
    { id: 12, syear: '2012', course: 'Ph.D. in Neuroscience', first: 25, second: 20, third: 15, total: 40 },
    { id: 13, syear: '2012', course: 'Master in Business Administration', first: 30, second: 25, third: 20, total: 40 },
    { id: 14, syear: '2012', course: 'Ph.D. in Robotics', first: 18, second: 12, third: 8, total: 40 },
    { id: 15, syear: '2012', course: 'Master in Environmental Engineering', first: 15, second: 10, third: 5, total: 40 },
    { id: 16, syear: '2012', course: 'Ph.D. in Linguistics', first: 22, second: 18, third: 14, total: 40 },
    { id: 17, syear: '2012', course: 'Master in Public Health', first: 35, second: 30, third: 25, total: 40 },
    { id: 18, syear: '2012', course: 'Ph.D. in Astrophysics', first: 16, second: 11, third: 6, total: 40 },
    { id: 19, syear: '2012', course: 'Master in Urban Planning', first: 24, second: 20, third: 16, total: 40 },
    { id: 20, syear: '2012', course: 'Ph.D. in Artificial Intelligence', first: 28, second: 22, third: 18, total: 40 },

    { id: 21, syear: '2012', course: 'Master in Data Science', first: 20, second: 15, third: 10, total: 40 },
    { id: 22, syear: '2012', course: 'Ph.D. in Neuroscience', first: 25, second: 20, third: 15, total: 40 },
    { id: 23, syear: '2012', course: 'Master in Business Administration', first: 30, second: 25, third: 20, total: 40 },
    { id: 24, syear: '2012', course: 'Ph.D. in Robotics', first: 18, second: 12, third: 8, total: 40 },
    { id: 25, syear: '2012', course: 'Master in Environmental Engineering', first: 15, second: 10, third: 5, total: 40 },
    { id: 26, syear: '2012', course: 'Ph.D. in Linguistics', first: 22, second: 18, third: 14, total: 40 },
    { id: 27, syear: '2012', course: 'Master in Public Health', first: 35, second: 30, third: 25, total: 40 },
    { id: 28, syear: '2012', course: 'Ph.D. in Astrophysics', first: 16, second: 11, third: 6, total: 40 },
    { id: 29, syear: '2012', course: 'Master in Urban Planning', first: 24, second: 20, third: 16, total: 40 },
    { id: 30, syear: '2012', course: 'Ph.D. in Artificial Intelligence', first: 28, second: 22, third: 18, total: 40 },
];
