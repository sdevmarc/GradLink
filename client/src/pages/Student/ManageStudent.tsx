import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useNavigate } from 'react-router-dom'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default function ManageStudent() {
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
                                MANAGE STUDENTS
                            </h1>
                        </div>
                        <div className="w-full h-[10%] flex justify-end items-center px-[1rem]">
                            <Button variant="contained">
                                ADD STUDENT
                            </Button>
                        </div>
                        <div className="w-full h-[85%] p-[1rem]">
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

const renderActionButtons = (params: any) => {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Button variant="text">
                <EditIcon />
            </Button>
            <Button variant='text'>
                <DeleteIcon />
            </Button>
        </div>
    );
};


const columns: GridColDef[] = [
    { field: 'id', headerName: 'No.', width: 70 },
    { field: 'idnum', headerName: 'ID Number', width: 100 },
    { field: 'syear', headerName: 'School Year', type: 'number', width: 100 },
    { field: 'course', headerName: 'Course Name', width: 250 },
    { field: 'semester', headerName: 'Semester', width: 200 },
    { field: 'lastname', headerName: 'Last Name', width: 200 },
    { field: 'firstname', headerName: 'First Name', width: 200 },
    { field: 'middlename', headerName: 'Middle Initial', width: 130, headerAlign: 'center', align: 'center' },
    { field: 'action', headerName: 'Actions', width: 200, renderCell: renderActionButtons, align: 'center', headerAlign: 'center' },
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
    { id: 1, idnum: 12341234, syear: '2012', course: 'Master in Data Science', semester: 'First Semester', lastname: 'Smith', firstname: 'John', middlename: 'A' },
    { id: 2, idnum: 54321543, syear: '2014', course: 'Master in Urban Planning', semester: 'Second Semester', lastname: 'Johnson', firstname: 'Emily', middlename: 'B' },
    { id: 3, idnum: 98769876, syear: '2015', course: 'Ph.D. in Robotics', semester: 'First Semester', lastname: 'Williams', firstname: 'Michael', middlename: 'C' },
    { id: 4, idnum: 87658765, syear: '2016', course: 'Master in Public Health', semester: 'First Semester', lastname: 'Jones', firstname: 'Jessica', middlename: 'D' },
    { id: 5, idnum: 45674567, syear: '2013', course: 'Ph.D. in Linguistics', semester: 'First Semester', lastname: 'Brown', firstname: 'Daniel', middlename: 'E' },
    { id: 6, idnum: 23456789, syear: '2018', course: 'Master in Environmental Engineering', semester: 'First Semester', lastname: 'Davis', firstname: 'Sophia', middlename: 'F' },
    { id: 7, idnum: 89768976, syear: '2011', course: 'Ph.D. in Astrophysics', semester: 'Third Semester', lastname: 'Miller', firstname: 'Matthew', middlename: 'G' },
    { id: 8, idnum: 56785678, syear: '2017', course: 'Master in Business Administration', semester: 'First Semester', lastname: 'Wilson', firstname: 'Olivia', middlename: 'H' },
    { id: 9, idnum: 34567890, syear: '2019', course: 'Ph.D. in Neuroscience', semester: 'Second Semester', lastname: 'Taylor', firstname: 'William', middlename: 'I' },
    { id: 10, idnum: 78907890, syear: '2010', course: 'Ph.D. in Artificial Intelligence', semester: 'First Semester', lastname: 'Anderson', firstname: 'Emma', middlename: 'J' },
    { id: 11, idnum: 12348901, syear: '2014', course: 'Master in Public Health', semester: 'Third Semester', lastname: 'Thomas', firstname: 'Alexander', middlename: 'K' },
    { id: 12, idnum: 89012345, syear: '2013', course: 'Ph.D. in Linguistics', semester: 'First Semester', lastname: 'Jackson', firstname: 'Madison', middlename: 'L' },
    { id: 13, idnum: 45678901, syear: '2015', course: 'Master in Data Science', semester: 'Second Semester', lastname: 'White', firstname: 'Ethan', middlename: 'M' },
    { id: 14, idnum: 56789012, syear: '2011', course: 'Master in Urban Planning', semester: 'First Semester', lastname: 'Harris', firstname: 'Isabella', middlename: 'N' },
    { id: 15, idnum: 78901234, syear: '2019', course: 'Ph.D. in Astrophysics', semester: 'First Semester', lastname: 'Martin', firstname: 'Noah', middlename: 'O' },
    { id: 16, idnum: 89012345, syear: '2017', course: 'Ph.D. in Robotics', semester: 'Second Semester', lastname: 'Thompson', firstname: 'Ava', middlename: 'P' },
    { id: 17, idnum: 90123456, syear: '2016', course: 'Master in Environmental Engineering', semester: 'First Semester', lastname: 'Garcia', firstname: 'James', middlename: 'Q' },
    { id: 18, idnum: 12345678, syear: '2018', course: 'Master in Business Administration', semester: 'Second Semester', lastname: 'Martinez', firstname: 'Mia', middlename: 'R' },
    { id: 19, idnum: 34567890, syear: '2012', course: 'Ph.D. in Neuroscience', semester: 'Third Semester', lastname: 'Robinson', firstname: 'Benjamin', middlename: 'S' },
    { id: 20, idnum: 56789012, syear: '2010', course: 'Ph.D. in Artificial Intelligence', semester: 'First Semester', lastname: 'Clark', firstname: 'Charlotte', middlename: 'T' },
    { id: 21, idnum: 78901234, syear: '2013', course: 'Master in Public Health', semester: 'First Semester', lastname: 'Rodriguez', firstname: 'Elijah', middlename: 'U' },
    { id: 22, idnum: 90123456, syear: '2014', course: 'Master in Data Science', semester: 'Second Semester', lastname: 'Lewis', firstname: 'Amelia', middlename: 'V' },
    { id: 23, idnum: 23456789, syear: '2015', course: 'Master in Urban Planning', semester: 'Third Semester', lastname: 'Lee', firstname: 'Evelyn', middlename: 'W' },
    { id: 24, idnum: 78901234, syear: '2011', course: 'Ph.D. in Linguistics', semester: 'Third Semester', lastname: 'Walker', firstname: 'Logan', middlename: 'X' },
    { id: 25, idnum: 34567890, syear: '2017', course: 'Ph.D. in Robotics', semester: 'First Semester', lastname: 'Perez', firstname: 'Chloe', middlename: 'Y' },
    { id: 26, idnum: 90123456, syear: '2018', course: 'Master in Environmental Engineering', semester: 'First Semester', lastname: 'Hall', firstname: 'Liam', middlename: 'Z' },
    { id: 27, idnum: 56789012, syear: '2016', course: 'Master in Business Administration', semester: 'First Semester', lastname: 'Young', firstname: 'Avery', middlename: 'A' },
    { id: 28, idnum: 23456789, syear: '2012', course: 'Ph.D. in Neuroscience', semester: 'First Semester', lastname: 'Allen', firstname: 'Harper', middlename: 'B' },
    { id: 29, idnum: 78901234, syear: '2010', course: 'Ph.D. in Astrophysics', semester: 'Second Semester', lastname: 'Adams', firstname: 'Eli', middlename: 'C' },
    { id: 30, idnum: 56789012, syear: '2019', course: 'Ph.D. in Artificial Intelligence', semester: 'Third Semester', lastname: 'King', firstname: 'Luna', middlename: 'D' },
];
