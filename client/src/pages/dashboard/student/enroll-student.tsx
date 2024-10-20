import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_COURSE_FINDALL } from '@/api/courses'
import * as React from "react"
import { ROUTES } from '@/constants'
import { IAPIStudents, ICourses } from '@/interface/student.interface'
import { API_STUDENT_CREATE } from '@/api/student'
import { CircleCheck, CircleX, Plus } from 'lucide-react'
import { API_PROGRAM_FINDALL } from '@/api/program'
import { CreateProgramInCourseColumns } from '../program/program-data-table-components/program/create-program/sub/columns'
import { IAPIPrograms } from '@/interface/program.interface'
import { DataTableCreateProgramInCourse } from '../program/program-data-table-components/program/create-program/sub/data-table-program-create'
import { DataTableEnrollStudent } from './student-data-table-components/enroll-student/data-table-enroll-student'
import { StudentCourseColumns } from './student-data-table-components/enroll-student/columns-student-enroll'
import { IAPICourse } from '@/interface/course.interface'
import Loading from '@/components/loading'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import { API_CURRICULUM_ISEXISTS, API_SEMESTER_ISEXISTS } from '@/api/curriculum'
import { useNavigate } from 'react-router-dom'
import { toast } from "sonner"

export default function CreateStudent() {
    const navigate = useNavigate()
    const [semester, setSemester] = React.useState<string>('')
    const [step, setStep] = React.useState<'curriculum' | 'semester' | 'form'>('curriculum')
    const [alertdialogstate, setAlertDialogState] = React.useState({
        show: false,
        title: '',
        description: '',
        success: false
    })

    const [inputdialogstate, setInputDialogState] = React.useState({
        show: false,
        title: '',
        description: '',
        success: false
    })

    const { data: iscurriculum, isLoading: iscurriculumLoading, isFetched: iscurriculumFetched } = useQuery({
        queryFn: () => API_CURRICULUM_ISEXISTS(),
        queryKey: ['curriculum_exists']
    })

    React.useEffect(() => {
        if (iscurriculumFetched) {
            if (!iscurriculum.success) {
                setAlertDialogState(prev => ({
                    ...prev,
                    show: true,
                    title: 'Uh, oh. Something went wrong!',
                    description: iscurriculum.message,
                    success: false
                }))
            } else {
                setStep('semester')
            }
        }
    }, [iscurriculum, iscurriculumFetched, step])

    const { data: issemester, isLoading: issemesterLoading, isFetched: issemesterFetched } = useQuery({
        queryFn: () => API_SEMESTER_ISEXISTS(),
        queryKey: ['semester_exists'],
        enabled: step === 'semester'
    })

    React.useEffect(() => {
        if (step === 'semester' && issemesterFetched) {
            if (!issemester.success) {
                setInputDialogState(prev => ({
                    ...prev,
                    show: true,
                    title: 'Uh, oh. Something went wrong!',
                    description: issemester.message
                }))
            } else {
                setSemester(issemester.data)
                setStep('form')
            }
        }
    }, [issemester, semester, step])


    const isLoading = iscurriculumLoading || (step === 'semester' && issemesterLoading)

    return (
        <>
            {isLoading && <Loading />}

            <AlertDialogConfirmation
                btnTitle='Continue'
                className='w-full py-4'
                isDialog={alertdialogstate.show}
                setDialog={(open) => setAlertDialogState(prev => ({ ...prev, show: open }))}
                type={`alert`}
                title={alertdialogstate.title}
                description={alertdialogstate.description}
                icon={alertdialogstate.success ? <CircleCheck color="#42a626" size={70} /> : <CircleX color="#880808" size={70} />}
                variant={`default`}
                btnContinue={() => {
                    navigate(-1)
                    setAlertDialogState(prev => ({ ...prev, show: false }))
                }}
            />

            <AlertDialogConfirmation
                btnTitle='Continue'
                className='w-full py-4'
                isDialog={inputdialogstate.show}
                setDialog={(open) => setInputDialogState(prev => ({ ...prev, show: open }))}
                type={`input`}
                title={inputdialogstate.title}
                description={inputdialogstate.description}
                variant={`default`}
                btnContinue={() => {
                    if (semester === '') {
                        setInputDialogState(prev => ({ ...prev, show: false }))
                        setAlertDialogState(prev => ({ ...prev, show: true, title: 'Uh, oh. Something went wrong!', description: 'Please select a semester.', success: false }))
                        return
                    }
                    setInputDialogState(prev => ({ ...prev, show: false }))
                }}
                combovalue={semester}
                setCombobox={(item) => setSemester(item)}
            />

            {(step === 'form' || semester) && (
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
                            <CreateForm semester={semester} />
                        </main>
                    </div>
                </div>
            )
            }
        </>
    )
}

const CreateForm = ({ semester }: { semester?: string }) => {
    const queryClient = useQueryClient()
    const [selectedPrograms, setSelectedPrograms] = React.useState<string[]>([])
    const [isAddAdditional, setIsAddAdditional] = React.useState<boolean>(false)
    const [resetSelection, setResetSelection] = React.useState(false)
    const [dialogsubmit, setDialogSubmit] = React.useState<boolean>(false)
    const [alertdialogstate, setAlertDialogState] = React.useState({
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
        queryKey: ['courses']
    })

    const { data: dataProgram, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['programs']
    })

    React.useEffect(() => {
        if (semester) {
            setStudent(prev => ({
                ...prev,
                semester: semester
            }))
        }
    }, [semester])

    const { mutateAsync: insertStudent, isPending: insertstudentLoading } = useMutation({
        mutationFn: API_STUDENT_CREATE,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogSubmit(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                toast("Uh, oh. Something went wrong!", { description: data.message })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['students'] })
                await queryClient.refetchQueries({ queryKey: ['students'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                toast("Yay, success! 🎉", { description: data.message })
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setDialogSubmit(false)
                setResetSelection(true)
                setStudent(prev => ({ ...prev, idNumber: '', name: '', email: '', enrollments: {} }))
                return
            }
        },
        onError: (data) => {
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async () => {
        if (selectedPrograms.length === 0) {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'You need to select a degree.' })
            return
        }
        const { idNumber, name, email, enrollments = {} } = student
        const nospaceIdNumber = (idNumber ?? '').replace(/\s+/g, '')
        const nospaceEmail = (email ?? '').replace(/\s+/g, '').toLowerCase()

        if (nospaceIdNumber === '' || !name || nospaceEmail === '' || !(enrollments.courses?.length || 0)) {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please fill-up the required fields.' })
            return
        }
        await insertStudent({ idNumber: nospaceIdNumber, name, email, enrollments, semester })
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
            const { _id } = item
            if (!_id) return
            return _id
        })
        if (selectedCodes.length > 1) return setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'You can only select one program, please deselect another program.' })
        setSelectedPrograms(selectedCodes.filter((_id): _id is string => _id !== undefined))
    }

    const handleOnClickAddAdditionalCourse = () => {
        if (selectedPrograms.length === 0) return setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'You need to select a degree first.' })
        setIsAddAdditional(true)
    }

    const isLoading = courseLoading || programLoading || insertstudentLoading

    return (
        <>
            {
                isLoading ? <Loading />
                    :
                    <>
                        <AlertDialogConfirmation
                            btnTitle='Continue'
                            className='w-full py-4'
                            isDialog={alertdialogstate.show}
                            setDialog={(open) => setAlertDialogState(prev => ({ ...prev, show: open }))}
                            type={`alert`}
                            title={alertdialogstate.title}
                            description={alertdialogstate.description}
                            icon={alertdialogstate.success ? <CircleCheck color="#42a626" size={70} /> : <CircleX color="#880808" size={70} />}
                            variant={`default`}
                            btnContinue={() => { setAlertDialogState(prev => ({ ...prev, show: false })) }}
                        />

                        <form className="w-[80%] flex flex-col justify-start gap-4 rounded-lg border">
                            <div className="w-full px-4 py-3 border-b">
                                <h1 className='text-text font-semibold text-lg'>Create a student</h1>
                            </div>
                            <div className="w-full py-2 flex flex-col">
                                <div className="w-full flex flex-col gap-4">
                                    <div className="flex flex-col px-4 gap-1">
                                        <h1 className='text-[.83rem]'>ID Number</h1>
                                        <Input
                                            disabled={isLoading}
                                            value={student.idNumber}
                                            onChange={handleInputChange}
                                            name='idNumber'
                                            type='text'
                                            placeholder='eg. 123'
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col px-4 gap-1">
                                        <h1 className='text-[.83rem]'>Full Name</h1>
                                        <Input
                                            disabled={isLoading}
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
                                            disabled={isLoading}
                                            value={student.email}
                                            onChange={handleInputChange}
                                            name='email'
                                            type='text'
                                            placeholder='eg. m@example.com'
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col px-4 gap-2">
                                        <div className="flex flex-col gap-1">
                                            <h1 className='text-[1.1rem] font-medium'>
                                                Program's Available
                                            </h1>
                                            <p className="text-sm">
                                                Please check degree(s) that you wish to enroll the student.
                                            </p>
                                        </div>
                                        <div className="w-full flex flex-col gap-2 justify-center items-start">
                                            {programLoading && <div>Loading...</div>}
                                            {
                                                programFetched &&
                                                <DataTableCreateProgramInCourse
                                                    data={dataProgram.data?.programs || []}
                                                    columns={CreateProgramInCourseColumns}
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
                                                data={course.data?.courses || []}
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
                                            <Button disabled={isLoading} variant={`outline`} size={`sm`} className="flex items-center gap-4" type="button" onClick={handleOnClickAddAdditionalCourse}>
                                                <Plus color="#000000" size={18} /> Add Additional Course
                                            </Button>
                                        </div>
                                    }
                                    <AlertDialogConfirmation
                                        isDialog={dialogsubmit}
                                        setDialog={(open) => setDialogSubmit(open)}
                                        type={`default`}
                                        disabled={isLoading}
                                        className='w-full my-3 py-5'
                                        variant={'default'}
                                        btnTitle="Add Program to Current Curriculum"
                                        title="Are you sure?"
                                        description={`This will add new programs to the current curriculum.`}
                                        btnContinue={handleSubmit}
                                    />
                                </div>
                            </div>
                        </form>
                    </>
            }
        </>
    )
}