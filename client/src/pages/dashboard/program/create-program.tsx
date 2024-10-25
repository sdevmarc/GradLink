import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { ROUTES } from '@/constants'
import MainTable from '@/components/main-table'
import { useState } from 'react'
import { CircleCheck, CircleX } from 'lucide-react'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import Loading from '@/components/loading'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { IAPIPrograms } from '@/interface/program.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_PROGRAM_NEW_PROGRAM } from '@/api/program'

export default function CreateProgram() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [isvalid, setValid] = useState<boolean>(false)
    const [dialogsubmit, setDialogSubmit] = useState<boolean>(false)
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })
    const [values, setValues] = useState<IAPIPrograms>({
        code: '',
        descriptiveTitle: '',
        residency: ''
    })

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setValues(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const { mutateAsync: addprogram, isPending: addprogramLoading } = useMutation({
        mutationFn: API_PROGRAM_NEW_PROGRAM,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogSubmit(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['programs'] })
                await queryClient.refetchQueries({ queryKey: ['programs'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setValid(true)
                setDialogSubmit(false)
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setValues({ code: '', descriptiveTitle: '', residency: '' })
                return
            }
        },
        onError: (data) => {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async () => {
        const { code, descriptiveTitle, residency } = values
        const upperCode = (code ?? '').replace(/\s+/g, '').toUpperCase()
        const noSpaceResidency = (residency ?? '').replace(/\s+/g, '').toUpperCase()

        if (upperCode === '' || !descriptiveTitle || noSpaceResidency === '') {
            setDialogSubmit(false)
            setValid(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please fill-up the required fields.' })
            return
        }

        if (isNaN(Number(residency))) {
            setDialogSubmit(false)
            setValid(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Residency should be a number.' })
            return
        }
        await addprogram({ code: upperCode, descriptiveTitle, residency: noSpaceResidency })
    }

    const isLoading = addprogramLoading

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
                    setAlertDialogState(prev => ({ ...prev, show: false }))
                    if (isvalid) return navigate(-1)
                }}
            />

            <div className="flex flex-col min-h-screen items-center">
                {isLoading && <Loading />}
                <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <BackHeadSection />
                            <SubHeadSectionDetails
                                title="CREATE A PROGRAM"
                                description="A tool for creating new program."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs bg='bg-muted' title="Programs" link={ROUTES.AVAILABLE_PROGRAMS} />
                            <SidebarNavs title="Courses" link={ROUTES.AVAILABLE_COURSES} />
                            <SidebarNavs title="Curriculums" link={ROUTES.CURRICULUM} />
                        </Sidebar>
                        <MainTable>
                            <div className="flex flex-col border gap-4 rounded-md">
                                <div className="w-full px-4 py-3 border-b">
                                    <h1 className='text-text font-semibold text-lg'>Configuration</h1>
                                </div>
                                <div className="w-full py-2 flex flex-col justify-between">
                                    <div className="w-full flex flex-col gap-4">
                                        <div className="flex flex-col px-4 gap-1">
                                            <h1 className='text-[.83rem]'>Code</h1>
                                            <Input
                                                value={values.code}
                                                disabled={isLoading}
                                                name='code'
                                                type='text'
                                                placeholder='eg. MLIS'
                                                onChange={handleOnChange}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col px-4 gap-1">
                                            <h1 className='text-[.83rem]'>Descriptive Title</h1>
                                            <Input
                                                value={values.descriptiveTitle}
                                                disabled={isLoading}
                                                name='descriptiveTitle'
                                                type='text'
                                                placeholder='eg. Library Information System'
                                                onChange={handleOnChange}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col px-4 gap-1">
                                            <h1 className='text-[.83rem]'>Residency</h1>
                                            <Input
                                                value={values.residency}
                                                disabled={isLoading}
                                                name='residency'
                                                type='text'
                                                placeholder='eg. 123'
                                                onChange={handleOnChange}
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
                                            btnTitle="Create program"
                                            title="Are you sure?"
                                            description={`This will add new programs to the current curriculum.`}
                                            btnContinue={handleSubmit}
                                        />
                                    </div>
                                </div>
                            </div>
                        </MainTable>
                    </main>
                </div>
            </div >
        </>
    )
}