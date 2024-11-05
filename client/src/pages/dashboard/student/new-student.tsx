import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Input } from '@/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as React from "react"
import { IAPIStudents } from '@/interface/student.interface'
import { API_STUDENT_NEW_STUDENT } from '@/api/student'
import { CircleCheck, CircleX, Plus, X } from 'lucide-react'
import Loading from '@/components/loading'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import { useNavigate } from 'react-router-dom'
import { Combobox } from '@/components/combobox'
import { API_CURRICULUM_FINDALL_ACTIVE } from '@/api/curriculum'
import { ICurriculum } from '@/interface/curriculum.interface'
import { DataTableSelectCoursesInNewStudent } from './student-data-table-components/new-student/data-table-select-courses-in-new-student'
import { SelectCoursesInNewStudentColumns } from './student-data-table-components/new-student/columns-select-courses-in-new-student'
import { Button } from '@/components/ui/button'
import { API_COURSE_FINDALL_COURSES_IN_NEW_STUDENT } from '@/api/courses'

export default function NewStudent() {
    return (
        <div className="flex flex-col min-h-screen items-center">
            <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                <aside className="px-4 pb-4 pt-[8rem]">
                    <HeadSection>
                        <BackHeadSection />
                        <SubHeadSectionDetails
                            title="CREATE NEW STUDENT"
                            description="A feature for adding new student into the system with detailed information."
                        />
                    </HeadSection>
                </aside>
                <main className="flex justify-end">
                    <CreateForm />
                </main>
            </div>
        </div>
    )
}

const CreateForm = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [isAdditional, setAdditional] = React.useState<boolean>(false)
    const [iseresetCourse, setResetCourse] = React.useState<boolean>(false)
    const [isinsertsuccess, setInsertSuccess] = React.useState<boolean>(false)
    const [dialogsubmit, setDialogSubmit] = React.useState<boolean>(false)
    const [formattedprograms, setFormattedPrograms] = React.useState([])
    const [alertdialogstate, setAlertDialogState] = React.useState({
        show: false,
        title: '',
        description: '',
        success: false
    })
    const [student, setStudent] = React.useState<IAPIStudents>({
        idNumber: '',
        lastname: '',
        firstname: '',
        middlename: '',
        email: '',
        program: '',
        courses: []
    })

    const { data: curriculum, isLoading: curriculumLoading, isFetched: curriculumFetched } = useQuery({
        queryFn: () => API_CURRICULUM_FINDALL_ACTIVE(),
        queryKey: ['programs']
    })

    React.useEffect(() => {
        if (curriculumFetched) {
            const formatCurriculum = curriculum?.data?.map((item: ICurriculum) => {
                const { _id, program } = item
                return { value: _id, label: program }
            })
            setFormattedPrograms(formatCurriculum)
        }
    }, [curriculum])

    const { data: course, isLoading: courseLoading, isFetched: courseFetched } = useQuery({
        queryFn: () => API_COURSE_FINDALL_COURSES_IN_NEW_STUDENT({ curriculumid: student.program }),
        queryKey: ['courses', { curriculum: student.program }],
        enabled: isAdditional === true && student.program !== ''
    })

    const { mutateAsync: insertStudent, isPending: insertstudentLoading } = useMutation({
        mutationFn: API_STUDENT_NEW_STUDENT,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogSubmit(false)
                setInsertSuccess(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['students'] })
                await queryClient.refetchQueries({ queryKey: ['students'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setAdditional(false)
                setInsertSuccess(true)
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setDialogSubmit(false)
                setStudent(prev => ({ ...prev, idNumber: '', lastname: '', firstname: '', middlename: '', email: '', program: '' }))
                return
            }
        },
        onError: (data) => {
            setInsertSuccess(false)
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async () => {
        const { idNumber, lastname, firstname, middlename, email, program, courses } = student
        const nospaceIdNumber = (idNumber ?? '').replace(/\s+/g, '')
        const nospaceEmail = (email ?? '').replace(/\s+/g, '').toLowerCase()

        if (nospaceIdNumber === '' || lastname === '' || firstname === '' || nospaceEmail === '' || !program) {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please fill-up the required fields.' })
            return
        }

        await insertStudent({ idNumber: nospaceIdNumber, lastname, firstname, middlename, email: nospaceEmail, program, courses })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setStudent((prev) => ({ ...prev, [name]: value }))
    }

    const isLoading = insertstudentLoading || curriculumLoading

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
                            btnContinue={() => {
                                setAlertDialogState(prev => ({ ...prev, show: false }))
                                if (isinsertsuccess) {
                                    navigate(-1)
                                    setInsertSuccess(false)
                                }
                            }}
                        />

                        <form className="w-[80%] flex flex-col justify-start gap-4 rounded-lg border">
                            <div className="w-full px-4 py-3 border-b">
                                <h1 className='text-text font-semibold text-lg'>Configuration</h1>
                            </div>
                            <div className="w-full py-2 flex flex-col">
                                <div className="w-full flex flex-col gap-4">
                                    <div className="flex flex-col px-4 gap-1">
                                        <h1 className="text-md font-medium">
                                            ID Number
                                        </h1>
                                        <Input
                                            disabled={isLoading}
                                            value={student.idNumber}
                                            onChange={handleInputChange}
                                            name='idNumber'
                                            className='w-[400px]'
                                            type='text'
                                            placeholder='eg. 123'
                                            required
                                        />
                                    </div>
                                    <div className="max-w-[400px] flex flex-col px-4 gap-1">
                                        <h1 className="text-md font-medium">
                                            Select Program
                                        </h1>
                                        <Combobox
                                            className='w-[300px]'
                                            lists={formattedprograms || []}
                                            placeholder={`None`}
                                            setValue={(item) => setStudent(prev => ({ ...prev, program: item }))}
                                            value={student.program || ''}
                                        />
                                    </div>

                                    <div className="flex items-center justify-start">
                                        <div className="flex flex-col px-4 gap-1">
                                            <h1 className="text-md font-medium">
                                                Last Name
                                            </h1>
                                            <Input
                                                disabled={isLoading}
                                                value={student.lastname}
                                                onChange={handleInputChange}
                                                name='lastname'
                                                type='text'
                                                className='w-[400px]'
                                                placeholder='eg. Nueva'
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col px-4 gap-1">
                                            <h1 className="text-md font-medium">
                                                First Name
                                            </h1>
                                            <Input
                                                disabled={isLoading}
                                                value={student.firstname}
                                                onChange={handleInputChange}
                                                name='firstname'
                                                className='w-[400px]'
                                                type='text'
                                                placeholder='eg. Jericho'
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-start">
                                        <div className="flex flex-col px-4 gap-1">
                                            <h1 className="text-md font-medium">
                                                Middle Name (Optional)
                                            </h1>
                                            <Input
                                                disabled={isLoading}
                                                value={student.middlename}
                                                onChange={handleInputChange}
                                                name='middlename'
                                                className='w-[400px]'
                                                type='text'
                                                placeholder='eg. Arman'
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col px-4 gap-1">
                                            <h1 className="text-md font-medium">
                                                Email Address
                                            </h1>
                                            <Input
                                                disabled={isLoading}
                                                value={student.email}
                                                onChange={handleInputChange}
                                                name='email'
                                                className='w-[400px]'
                                                type='text'
                                                placeholder='eg. m@example.com'
                                                required
                                            />
                                        </div>
                                    </div>
                                    {
                                        !isAdditional &&
                                        <div className="flex px-4">
                                            <Button onClick={() => {
                                                if (!student.program) return setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please select a program first.' })
                                                setAdditional(true)
                                            }
                                            } variant={`outline`} size={`sm`} type='button' className='flex gap-2'>
                                                <Plus color="#000000" size={18} /> Add Additional Course
                                            </Button>
                                        </div>
                                    }

                                    {
                                        isAdditional &&
                                        <div className="flex flex-col px-6 gap-2">
                                            <div className="flex items-center justify-between">
                                                <h1 className='text-md font-medium'>
                                                    Additional Courses
                                                </h1>
                                                <Button onClick={() => {
                                                    setAdditional(false)
                                                    setStudent(prev => ({
                                                        ...prev,
                                                        courses: []
                                                    }))
                                                }} variant={`ghost`} size={`sm`} type='button'>
                                                    <X color="#000000" size={18} /> Cancel
                                                </Button>
                                            </div>
                                            {
                                                courseLoading && <div>Course is loading...</div>
                                            }

                                            {
                                                courseFetched &&
                                                <DataTableSelectCoursesInNewStudent
                                                    columns={SelectCoursesInNewStudentColumns}
                                                    data={course?.data || []}
                                                    fetchAddedCourses={(e) => {
                                                        setStudent(prev => ({
                                                            ...prev,
                                                            courses: e.map(item => item._id).filter(id => id !== undefined) as string[]
                                                        }))
                                                    }}
                                                    resetSelection={iseresetCourse}
                                                    onResetComplete={() => setResetCourse(false)}
                                                />
                                            }

                                        </div>
                                    }


                                    <AlertDialogConfirmation
                                        isDialog={dialogsubmit}
                                        setDialog={(open) => setDialogSubmit(open)}
                                        type={`default`}
                                        disabled={isLoading}
                                        className='w-full my-3 py-5'
                                        variant={'default'}
                                        btnTitle="Create new student"
                                        title="Are you sure?"
                                        description={`This will add new student to the system and cannot be modified.`}
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