import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { Input } from '@/components/ui/input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as React from "react"
import { ROUTES } from '@/constants'
import { IAPIStudents } from '@/interface/student.interface'
import { API_STUDENT_NEW_STUDENT } from '@/api/student'
import { CircleCheck, CircleX } from 'lucide-react'
import Loading from '@/components/loading'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import { useNavigate } from 'react-router-dom'

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
                <main className="flex">
                    <Sidebar>
                        <SidebarNavs bg='bg-muted' title="Courses Offered" link={ROUTES.ENROLLMENT} />
                        <SidebarNavs title="Enrollees" link={ROUTES.STUDENT_ENROLLEE} />
                        <SidebarNavs title="Current Enrolled" link={ROUTES.CURRENTLY_ENROLLED} />
                    </Sidebar>
                    <CreateForm />
                </main>
            </div>
        </div>
    )
}

const CreateForm = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [isinsertsuccess, setInsertSuccess] = React.useState<boolean>(false)
    const [dialogsubmit, setDialogSubmit] = React.useState<boolean>(false)
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
    })

    const { mutateAsync: insertStudent, isPending: insertstudentLoading } = useMutation({
        mutationFn: API_STUDENT_NEW_STUDENT,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogSubmit(false)
                setInsertSuccess(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['student-enrollees'] })
                await queryClient.refetchQueries({ queryKey: ['student-enrollees'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setInsertSuccess(true)
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setDialogSubmit(false)
                setStudent(prev => ({ ...prev, idNumber: '', lastname: '', firstname: '', middlename: '', email: '' }))
                return
            }
        },
        onError: (data) => {
            setInsertSuccess(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async () => {
        const { idNumber, lastname, firstname, middlename, email } = student
        const nospaceIdNumber = (idNumber ?? '').replace(/\s+/g, '')
        const nospaceEmail = (email ?? '').replace(/\s+/g, '').toLowerCase()

        if (nospaceIdNumber === '' || lastname === '' || firstname === '' || middlename === '' || nospaceEmail === '') {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please fill-up the required fields.' })
            return
        }
        await insertStudent({ idNumber: nospaceIdNumber, lastname, firstname, middlename, email: nospaceEmail })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setStudent((prev) => ({ ...prev, [name]: value }))
    }

    const isLoading = insertstudentLoading

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
                                            className='w-[400px]'
                                            type='text'
                                            placeholder='eg. 123'
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center justify-start">
                                        <div className="flex flex-col px-4 gap-1">
                                            <h1 className='text-[.83rem]'>Last Name</h1>
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
                                            <h1 className='text-[.83rem]'>First Name</h1>
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
                                            <h1 className='text-[.83rem]'>Middle Name</h1>
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
                                            <h1 className='text-[.83rem]'>Email Address</h1>
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

                                    <AlertDialogConfirmation
                                        isDialog={dialogsubmit}
                                        setDialog={(open) => setDialogSubmit(open)}
                                        type={`default`}
                                        disabled={isLoading}
                                        className='w-full my-3 py-5'
                                        variant={'default'}
                                        btnTitle="Create new student"
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