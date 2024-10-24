import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { Input } from '@/components/ui/input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as React from "react"
import { ROUTES } from '@/constants'
import { IAPIStudents } from '@/interface/student.interface'
import { API_STUDENT_CREATE } from '@/api/student'
import { CircleCheck, CircleX } from 'lucide-react'
import Loading from '@/components/loading'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import { useNavigate } from 'react-router-dom'
import { toast } from "sonner"

export default function CreateStudent() {
    const navigate = useNavigate()
    const [alertdialogstate, setAlertDialogState] = React.useState({
        show: false,
        title: '',
        description: '',
        success: false
    })

    return (
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
                    navigate(-1)
                    setAlertDialogState(prev => ({ ...prev, show: false }))
                }}
            />
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

const CreateForm = () => {
    const queryClient = useQueryClient()
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
    })

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
                setStudent(prev => ({ ...prev, idNumber: '', name: '', email: '', enrollments: {} }))
                return
            }
        },
        onError: (data) => {
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async () => {
        const { idNumber, name, email, enrollments = {} } = student
        const nospaceIdNumber = (idNumber ?? '').replace(/\s+/g, '')
        const nospaceEmail = (email ?? '').replace(/\s+/g, '').toLowerCase()

        if (nospaceIdNumber === '' || !name || nospaceEmail === '' || !(enrollments.courses?.length || 0)) {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please fill-up the required fields.' })
            return
        }
        await insertStudent({ idNumber: nospaceIdNumber, name, email, enrollments })
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