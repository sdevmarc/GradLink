import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Input } from '@/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as React from "react"
import { IAPIStudents } from '@/interface/student.interface'
import { API_STUDENT_FINDONE, API_STUDENT_UPDATE_STUDENT } from '@/api/student'
import { CircleCheck, CircleX } from 'lucide-react'
import Loading from '@/components/loading'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '@/hooks/AuthContext'

export default function UpdateStudent() {
    const { isAuthenticated } = React.useContext(AuthContext);
    const navigate = useNavigate()

    React.useEffect(() => {
        if (!isAuthenticated) {
            // Redirect to login page if not authenticated
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate])

    return (
        <div className="flex flex-col min-h-screen items-center">
            <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                <aside className="px-4 pb-4 pt-[8rem]">
                    <HeadSection>
                        <BackHeadSection />
                        <SubHeadSectionDetails
                            title="UPDATE STUDENT"
                            description="A feature for updating student."
                        />
                    </HeadSection>
                </aside>
                <main className="flex justify-end">
                    <UpdateForm />
                </main>
            </div>
        </div>
    )
}

const UpdateForm = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { sid } = useParams()
    const [studentid, setStudentId] = React.useState<string>('')
    const [isinsertsuccess, setInsertSuccess] = React.useState<boolean>(false)
    const [dialogsubmit, setDialogSubmit] = React.useState<boolean>(false)
    const [alertdialogstate, setAlertDialogState] = React.useState({
        show: false,
        title: '',
        description: '',
        success: false
    })
    const [student, setStudent] = React.useState<IAPIStudents>({
        lastname: '',
        firstname: '',
        middlename: '',
        undergraduateInformation: {
            college: '',
            school: '',
            programGraduated: '',
            yearGraduated: ''
        }
    })

    React.useEffect(() => {
        if (sid) {
            const studentid = atob(sid);
            setStudentId(studentid)
        }
    }, [sid])

    const { data: studentdata, isLoading: studentdataLoading, isFetched: studentdataFetched } = useQuery({
        queryFn: () => API_STUDENT_FINDONE({ id: studentid }),
        queryKey: ['students', { studentid }]
    })

    React.useEffect(() => {
        if (studentdataFetched) {
            const { lastname, firstname, middlename, undergraduateInformation } = studentdata?.data
            const { college, school, programGraduated, yearGraduated } = undergraduateInformation || {}

            setStudent(prev => ({
                ...prev,
                lastname,
                firstname,
                middlename,
                undergraduateInformation: {
                    ...prev.undergraduateInformation,
                    college,
                    school,
                    programGraduated,
                    yearGraduated
                }
           }))
        }
    }, [studentdata])

    const { mutateAsync: updatestudent, isPending: updatestudentLoading } = useMutation({
        mutationFn: API_STUDENT_UPDATE_STUDENT,
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

    const handleSubmit = async () => {
        const { lastname, firstname, middlename, undergraduateInformation } = student
        const { college, school, programGraduated, yearGraduated } = undergraduateInformation || {}

        const nospaceCollege = (college ?? '').replace(/\s+/g, '')
        const nospaceSchool = (school ?? '').replace(/\s+/g, '')
        const nospaceProgramGraduated = (programGraduated ?? '').replace(/\s+/g, '')
        const nospaceYearGraduated = (yearGraduated ?? '').replace(/\s+/g, '')

        if (nospaceCollege === '' || nospaceSchool === '' || nospaceProgramGraduated === '' || nospaceYearGraduated === '') {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please fill-up the required fields.' })
            return
        }

        setDialogSubmit(false)
        await updatestudent({
            id: studentid,
            lastname: lastname ?? '',
            firstname: firstname ?? '',
            middlename: middlename ?? '',
            undergraduateInformation: undergraduateInformation
        })
        return
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setStudent((prev) => ({ ...prev, [name]: value }))
    }

    const isLoading = updatestudentLoading || studentdataLoading

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
                        {
                            studentdataFetched &&
                            <form className="w-[80%] flex flex-col justify-start gap-4 rounded-lg border">
                                <div className="w-full px-4 py-3 border-b">
                                    <h1 className='text-text font-semibold text-lg'>
                                        Student Information
                                    </h1>
                                </div>
                                <div className="w-full py-2 flex flex-col">
                                    <div className="w-full flex flex-col gap-4">
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
                                        </div>
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
                                        </div>

                                        <AlertDialogConfirmation
                                            isDialog={dialogsubmit}
                                            setDialog={(open) => setDialogSubmit(open)}
                                            type={`default`}
                                            disabled={isLoading}
                                            className='w-full my-3 py-5'
                                            variant={'default'}
                                            btnTitle="Update student"
                                            title="Are you sure?"
                                            description={`This will update the student to the system.`}
                                            btnContinue={handleSubmit}
                                        />
                                    </div>
                                </div>
                            </form>
                        }
                    </>
            }
        </>
    )
}