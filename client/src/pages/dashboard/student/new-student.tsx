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
        courses: [],
        undergraduateInformation: {
            college: '',
            school: '',
            programGraduated: '',
            yearGraduated: ''
        },
        achievements: {
            awards: '',
            examPassed: '',
            examDate: '',
            examRating: ''
        }
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

    const handleOnChangeUndegraduateInformation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setStudent(prev => ({
            ...prev,
            undergraduateInformation: {
                ...prev.undergraduateInformation,
                [name]: value
            }
        }))
    }

    const handleOnChangeAchievements = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setStudent(prev => ({
            ...prev,
            achievements: {
                ...prev.achievements,
                [name]: value
            }
        }))
    }

    const handleSubmit = async () => {
        const { idNumber, lastname, firstname, middlename, email, program, courses, undergraduateInformation, achievements } = student
        const { college, school, programGraduated, yearGraduated } = undergraduateInformation || {}
        const { awards, examPassed, examDate, examRating } = achievements || {}

        const nospaceIdNumber = (idNumber ?? '').replace(/\s+/g, '')
        const nospaceEmail = (email ?? '').replace(/\s+/g, '').toLowerCase()

        const nospaceCollege = (college ?? '').replace(/\s+/g, '')
        const nospaceSchool = (school ?? '').replace(/\s+/g, '')
        const nospaceProgramGraduated = (programGraduated ?? '').replace(/\s+/g, '')
        const nospaceYearGraduated = (yearGraduated ?? '').replace(/\s+/g, '')

        const nospaceAwards = (awards ?? '').replace(/\s+/g, '')
        const nospaceExamPassed = (examPassed ?? '').replace(/\s+/g, '')
        const nospaceExamDate = (examDate ?? '').replace(/\s+/g, '')
        const nospaceExamRating = (examRating ?? '').replace(/\s+/g, '')

        if (nospaceIdNumber === '' || lastname === '' || firstname === '' || nospaceEmail === '' || !program) {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please fill-up the required fields.' })
            return
        }

        if (nospaceCollege === '' || nospaceSchool === '' || nospaceProgramGraduated === '' || nospaceYearGraduated === '') {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please fill-up the required fields.' })
            return
        }

        if (nospaceAwards === '' || nospaceExamPassed === '' || nospaceExamDate === '' || nospaceExamRating === '') {
            if (isNaN(Number(nospaceExamRating))) {
                setDialogSubmit(false)
                setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Exam rating must be a number.' })
                return
            }
            setDialogSubmit(false)
            await insertStudent({
                idNumber: nospaceIdNumber,
                lastname,
                firstname,
                middlename,
                email: nospaceEmail,
                program,
                courses,
                undergraduateInformation
            })
        }

        setDialogSubmit(false)
        await insertStudent({
            idNumber: nospaceIdNumber,
            lastname,
            firstname,
            middlename,
            email: nospaceEmail,
            program,
            courses,
            undergraduateInformation,
            achievements
        })
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
                                <h1 className='text-text font-semibold text-lg'>
                                    Student Information
                                </h1>
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
                                            placeholder='eg. 12345678'
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
                                                placeholder='eg. Dela Cruz'
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
                                                placeholder='eg. Juan'
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
                                                placeholder='eg. Rizal'
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
                                                placeholder='eg. juandelacruz@example.com'
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
                                    <div className="flex flex-col px-4 border gap-4 p-4 m-4">
                                        <h1 className="text-xl font-semibold">
                                            Undergraduate Information
                                        </h1>
                                        <div className="flex items-center justify-start">
                                            <div className="flex flex-col mx-4 gap-1">
                                                <h1 className="text-md font-medium">
                                                    College/University
                                                </h1>
                                                <Input
                                                    disabled={isLoading}
                                                    name='college'
                                                    onChange={handleOnChangeUndegraduateInformation}
                                                    value={student.undergraduateInformation?.college}
                                                    className='w-[400px]'
                                                    type='text'
                                                    placeholder='eg. College/University'
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col mr-4 gap-1">
                                                <h1 className="text-md font-medium">
                                                    School
                                                </h1>
                                                <Input
                                                    disabled={isLoading}
                                                    name='school'
                                                    onChange={handleOnChangeUndegraduateInformation}
                                                    value={student.undergraduateInformation?.school}
                                                    className='w-[400px]'
                                                    type='text'
                                                    placeholder='eg. School'
                                                    required
                                                />
                                            </div>

                                        </div>
                                        <div className="flex items-center justify-start">
                                            <div className="flex flex-col mx-4 gap-1">
                                                <h1 className="text-mr font-medium">
                                                    Program
                                                </h1>
                                                <Input
                                                    disabled={isLoading}
                                                    name='programGraduated'
                                                    onChange={handleOnChangeUndegraduateInformation}
                                                    value={student.undergraduateInformation?.programGraduated}
                                                    className='w-[400px]'
                                                    type='text'
                                                    placeholder="eg. Bachelor's Degree"
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col mr-4 gap-1">
                                                <h1 className="text-md font-medium">
                                                    Year Graduated
                                                </h1>
                                                <Input
                                                    disabled={isLoading}
                                                    name='yearGraduated'
                                                    onChange={handleOnChangeUndegraduateInformation}
                                                    value={student.undergraduateInformation?.yearGraduated}
                                                    className='w-[400px]'
                                                    type='text'
                                                    placeholder='eg. YYYY'
                                                    required
                                                />
                                            </div>

                                        </div>
                                        <div className="flex items-center justify-start">
                                            <div className="flex flex-col mx-4 gap-1">
                                                <h1 className="text-mr font-medium">
                                                    Honors/Awards Received
                                                </h1>
                                                <Input
                                                    disabled={isLoading}
                                                    name='awards'
                                                    onChange={handleOnChangeAchievements}
                                                    value={student.achievements?.awards}
                                                    className='w-[400px]'
                                                    type='text'
                                                    placeholder='eg. Academic Award'
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col mr-4 gap-1">
                                                <h1 className="text-md font-medium">
                                                    Professional Exam Passed
                                                </h1>
                                                <Input
                                                    disabled={isLoading}
                                                    name='examPassed'
                                                    onChange={handleOnChangeAchievements}
                                                    value={student.achievements?.examPassed}
                                                    className='w-[400px]'
                                                    type='text'
                                                    placeholder='eg. CSE/LEPT/CPALE'
                                                    required
                                                />
                                            </div>

                                        </div>
                                        <div className="flex items-center justify-start">
                                            <div className="flex flex-col mx-4 gap-1">
                                                <h1 className="text-mr font-medium">
                                                    Professional Exam Date
                                                </h1>
                                                <Input
                                                    disabled={isLoading}
                                                    name='examDate'
                                                    onChange={handleOnChangeAchievements}
                                                    value={student.achievements?.examDate}
                                                    className='w-[400px]'
                                                    type='text'
                                                    placeholder='eg. MM-DD-YYYY'
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col mr-4 gap-1">
                                                <h1 className="text-md font-medium">
                                                    Professional Exam Rating
                                                </h1>
                                                <Input
                                                    disabled={isLoading}
                                                    name='examRating'
                                                    onChange={handleOnChangeAchievements}
                                                    value={student.achievements?.examRating}
                                                    className='w-[400px]'
                                                    type='text'
                                                    placeholder='eg. 90%'
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

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