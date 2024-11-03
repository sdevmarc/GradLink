import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Input } from '@/components/ui/input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_COURSE_CREATE } from '@/api/courses'
import { IAPICourse } from '@/interface/course.interface'
import React, { useState } from 'react'
import { CircleCheck, CircleX } from 'lucide-react'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import Loading from '@/components/loading'
import { useNavigate } from 'react-router-dom'

export default function CreateCourse() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <BackHeadSection />
                            <SubHeadSectionDetails
                                title="CREATE A COURSE"
                                description="A tool for creating and managing course offerings, including course details and structure."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex justify-end">
                        <CreateForm />
                    </main>
                </div>
            </div>
        </>
    )
}

const CreateForm = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [dialogsubmit, setDialogSubmit] = React.useState<boolean>(false)
    const [isValid, setValid] = useState<boolean>(false)
    const [course, setCourse] = React.useState<IAPICourse>({
        code: '',
        courseno: '',
        descriptiveTitle: '',
        units: 0,
    })
    const [alertdialogstate, setAlertDialogState] = React.useState({
        show: false,
        title: '',
        description: '',
        success: false
    })

    const { mutateAsync: insertCourse, isPending: insertcoursePending } = useMutation({
        mutationFn: API_COURSE_CREATE,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogSubmit(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['courses'] })
                await queryClient.refetchQueries({ queryKey: ['courses'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setValid(true)
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setDialogSubmit(false)
                setCourse(({ code: '', courseno: '', descriptiveTitle: '', units: 0 }))
                return
            }
        },
        onError: (data) => {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async () => {
        const { code, courseno, descriptiveTitle, units } = course

        const nospaceCode = (code ?? '').replace(/\s+/g, '')
        const nospaceUnits = String(units ?? '').replace(/\s+/g, '')
        const upperCourseno = (courseno ?? '').replace(/\s+/g, '').toUpperCase()
        const trimmedDescriptiveTitle = descriptiveTitle?.trim()

        if (nospaceCode === '' || upperCourseno === '' || !trimmedDescriptiveTitle || nospaceUnits === '') {
            setDialogSubmit(false)
            setValid(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please fill-up the required fields.' })
            return
        }

        if (isNaN(Number(nospaceCode))) {
            setDialogSubmit(false)
            setValid(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Code must be a number.' })
            return
        }

        if (isNaN(Number(nospaceUnits))) {
            setDialogSubmit(false)
            setValid(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Units must be a number.' })
            return
        }
        await insertCourse({ code: nospaceCode, courseno: upperCourseno, descriptiveTitle: trimmedDescriptiveTitle, units: Number(nospaceUnits) })
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCourse((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const isLoading = insertcoursePending

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
                    setAlertDialogState(prev => ({ ...prev, show: false }))
                    if (isValid) return navigate(-1)
                }}
            />

            <div className="w-[80%] flex flex-col justify-start gap-4 rounded-lg border">
                <div className="w-full px-4 py-3 border-b">
                    <h1 className='text-text font-semibold text-lg'>Configuration</h1>
                </div>
                <div className="w-full py-2 flex flex-col justify-between">
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex flex-col px-4 gap-1">
                            <h1 className="text-md font-medium">
                                Code
                            </h1>
                            <Input
                                disabled={isLoading}
                                value={course.code}
                                name='code'
                                type='text'
                                placeholder='eg. 100'
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col px-4 gap-1">
                            <h1 className="text-md font-medium">Course Number</h1>
                            <Input
                                disabled={isLoading}
                                value={course.courseno}
                                name='courseno'
                                type='text'
                                placeholder='eg. LIS100'
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col px-4 gap-1">
                            <h1 className="text-md font-medium">Descriptive Title</h1>
                            <Input
                                disabled={isLoading}
                                value={course.descriptiveTitle}
                                name='descriptiveTitle'
                                type='text'
                                placeholder='eg. Library Information System'
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col px-4 gap-1">
                            <h1 className="text-md font-medium">Units</h1>
                            <Input
                                disabled={isLoading}
                                value={course.units}
                                name='units'
                                type='text'
                                placeholder='eg. 123'
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                        <div className="px-4">
                            <AlertDialogConfirmation
                                isDialog={dialogsubmit}
                                setDialog={(open) => setDialogSubmit(open)}
                                type={`default`}
                                disabled={isLoading}
                                className='w-full my-3 py-5'
                                variant={'default'}
                                btnTitle="Create course"
                                title="Are you sure?"
                                description={`This will permanently add a new course to the system, and cannot be modified.`}
                                btnContinue={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}