import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_COURSE_FINDALL } from '@/api/courses'
import * as React from "react"
import { ROUTES } from '@/constants'
import { IAPIStudents, ICourses } from '@/interface/student.interface'
import { ComboBox } from '@/components/combo-box'
import { API_STUDENT_CREATE } from '@/api/student'
import ContinueDialog from '@/components/continue-dialog'
import { CircleCheck, CircleX, Plus } from 'lucide-react'
import { API_PROGRAM_FINDALL } from '@/api/program'
import { CreateProgramColumns } from '../program/program-data-table-components/program/columns'
import { IAPIPrograms } from '@/interface/program.interface'
import { DataTableCreateProgram } from '../program/program-data-table-components/program/data-table-program-create'
import { DataTableEnrollStudent } from './student-data-table-components/enroll-student/data-table-enroll-student'
import { StudentCourseColumns } from './student-data-table-components/enroll-student/columns-student-enroll'
import { IAPICourse } from '@/interface/course.interface'
import Loading from '@/components/loading'

export default function CreateStudent() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <BackHeadSection />
                            <SubHeadSectionDetails
                                title="CREATE A STUDENT"
                                description="A feature for adding and registering new student records into the system with detailed information."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs bg='bg-muted' title="Currently Enrolled" link={ROUTES.CURRENTLY_ENROLLED} />
                            <SidebarNavs title="List of Students" link={ROUTES.LIST_OF_STUDENTS} />
                            <SidebarNavs title="Alumni Graduates" link={ROUTES.ALUMNI_GRADUATES} />
                        </Sidebar>
                        <CreateForm />
                    </main>
                </div>
            </div>
        </>
    )
}

const lists = [
    { value: '1', label: 'First' },
    { value: '2', label: 'Second' },
    { value: '3', label: 'Third' },
]

const CreateForm = () => {
    const queryClient = useQueryClient()
    const [selectedPrograms, setSelectedPrograms] = React.useState<string[]>([])
    const [isAddAdditional, setIsAddAdditional] = React.useState<boolean>(false)
    const [resetSelection, setResetSelection] = React.useState(false)
    const [dialogState, setDialogState] = React.useState({
        show: false,
        title: '',
        description: '',
        success: false
    })
    const [student, setStudent] = React.useState<IAPIStudents>({
        idNumber: '',
        name: '',
        email: '',
        enrollments: {}
    })
    const { data: course, isLoading: courseLoading, isFetched: courseFetched } = useQuery({
        queryFn: () => API_COURSE_FINDALL(),
        queryKey: ['course']
    })

    const { data: dataProgram, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['program']
    })


    const { mutateAsync: insertStudent, isPending: studentLoading } = useMutation({
        mutationFn: API_STUDENT_CREATE,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
            } else {
                await queryClient.invalidateQueries({ queryKey: ['students'] })
                await queryClient.refetchQueries({ queryKey: ['students'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setDialogState({ success: true, show: true, title: 'Yay, Success', description: data.message })
                setResetSelection(true)
                setStudent(prev => ({ ...prev, idNumber: '', name: '', email: '', enrollments: {} }))
            }
        },
        onError: (data) => {
            setDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (selectedPrograms.length === 0) return setDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'You need to select a degree.' })
        const { idNumber, name, email, enrollments } = student

        if (!idNumber?.trim() || !name || !email?.trim() || !enrollments?.semester || !(enrollments.courses?.length || 0)) return alert('Please fill-up the required fields.')
        await insertStudent({ idNumber, name, email, enrollments })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setStudent((prev) => ({ ...prev, [name]: value }))
    }

    const handleCoursesChange = (selectedCourses: IAPICourse[]) => {
        const courses: ICourses[] = selectedCourses.map(({ courseno, descriptiveTitle, units }) => ({
            courseno: courseno || '',
            descriptive_title: descriptiveTitle || '',
            units: Number(units || 0)
        }))

        setStudent(prev => ({
            ...prev,
            enrollments: {
                ...prev.enrollments,
                courses
            }
        }))
    }

    const handleProgramChange = (programs: IAPIPrograms[]) => {
        const selectedCodes = programs?.map(item => {
            const { code } = item
            if (!code) return
            return code
        })
        setSelectedPrograms(selectedCodes.filter((code): code is string => code !== undefined))
    }

    const handleOnClickAddAdditionalCourse = () => {
        if (selectedPrograms.length === 0) return setDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'You need to select a degree first.' })
        setIsAddAdditional(true)
    }

    return (
        <>
            {
                studentLoading ? <Loading />
                    :
                    <form onSubmit={handleSubmit} className="w-[80%] flex flex-col justify-start gap-4 rounded-lg border">
                        <ContinueDialog
                            icon={dialogState.success ? <CircleCheck color="#42a626" size={70} /> : <CircleX color="#880808" size={70} />}
                            trigger={dialogState.show}
                            title={dialogState.title}
                            description={dialogState.description}
                            onClose={() => { setDialogState(prev => ({ ...prev, show: false })) }}
                        />
                        <div className="w-full px-4 py-3 border-b">
                            <h1 className='text-text font-semibold text-lg'>Create a student</h1>
                        </div>
                        <div className="w-full py-2 flex flex-col justify-between">
                            <div className="w-full flex flex-col gap-4">
                                <div className="flex flex-col px-4 gap-1">
                                    <h1 className='text-[.83rem]'>ID Number</h1>
                                    <Input
                                        disabled={studentLoading}
                                        value={student.idNumber}
                                        onChange={handleInputChange}
                                        name='idNumber'
                                        type='text'
                                        placeholder='eg. 000xxxxxx'
                                        required
                                    />
                                </div>
                                <div className="flex flex-col px-4 gap-1">
                                    <h1 className='text-[.83rem]'>Full Name</h1>
                                    <Input
                                        disabled={studentLoading}
                                        value={student.name}
                                        onChange={handleInputChange}
                                        name='name'
                                        type='text'
                                        placeholder='eg. John Doe'
                                        required
                                    />
                                </div>
                                <div className="flex flex-col px-4 gap-1">
                                    <h1 className='text-[.83rem]'>Email Address</h1>
                                    <Input
                                        disabled={studentLoading}
                                        value={student.email}
                                        onChange={handleInputChange}
                                        name='email'
                                        type='text'
                                        placeholder='eg. m@example.com'
                                        required
                                    />
                                </div>
                                <div className="max-w-lg flex flex-col px-4 gap-1">
                                    <h1 className='text-[.83rem]'>Choose a semester</h1>
                                    <ComboBox
                                        type={
                                            (e) => {
                                                setStudent(prev => ({
                                                    ...prev,
                                                    enrollments: { ...prev.enrollments, semester: e || '' }
                                                }))
                                            }
                                        }
                                        title='None'
                                        lists={lists || []}
                                        value={student.enrollments?.semester || ''}
                                    />
                                </div>
                                <div className="flex flex-col px-4 gap-2">
                                    <div className="flex flex-col gap-1">
                                        <h1 className='text-[1.1rem] font-medium'>
                                            Degree's Available
                                        </h1>
                                        <p className="text-sm">
                                            Please check degree(s) that you wish to enroll the student.
                                        </p>
                                    </div>
                                    <div className="w-full flex flex-col gap-2 justify-center items-start">
                                        {programLoading && <div>Loading...</div>}
                                        {
                                            programFetched &&
                                            <DataTableCreateProgram
                                                data={dataProgram.data || []}
                                                columns={CreateProgramColumns}
                                                fetchCheck={handleProgramChange}
                                                resetSelection={resetSelection}
                                                onResetComplete={() => setResetSelection(false)}
                                            />
                                        }
                                    </div>
                                </div>

                                <div className={`${!isAddAdditional && 'hidden'} flex flex-col px-4 gap-2`}>
                                    <div className="flex flex-col gap-1">
                                        <h1 className='text-[1.1rem] font-medium'>
                                            Courses Available
                                        </h1>
                                        <p className="text-sm">
                                            Please check the courses that you wish to enroll.
                                        </p>
                                    </div>
                                    <div className="w-full flex flex-col gap-2 justify-center items-start">
                                        {courseLoading && <div>Loading...</div>}
                                        {courseFetched && <DataTableEnrollStudent
                                            data={course.data || []}
                                            columns={StudentCourseColumns}
                                            onSubmit={handleCoursesChange}
                                            resetSelection={resetSelection}
                                            onResetComplete={() => setResetSelection(false)}
                                            selectedPrograms={selectedPrograms}
                                            isAdditional={(e) => setIsAddAdditional(e)}
                                        />}
                                    </div>
                                </div>
                                {
                                    !isAddAdditional &&
                                    <div className="flex px-4">
                                        <Button disabled={studentLoading} variant={`outline`} size={`sm`} className="flex items-center gap-4" type="button" onClick={handleOnClickAddAdditionalCourse}>
                                            <Plus color="#000000" size={18} /> Add Additional Course
                                        </Button>
                                    </div>
                                }
                                <div className="w-full flex items-center justify-end px-4">
                                    <Button disabled={studentLoading} type='submit' variant={`default`} size={`sm`}>
                                        {studentLoading ? 'Submitting...' : 'Submit Enrollment'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
            }
        </>
    )
}