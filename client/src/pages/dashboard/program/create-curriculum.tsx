import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import MainTable from '@/components/main-table'
import { ROUTES } from '@/constants'
import { IAPIPrograms } from '@/interface/program.interface'
import { useState } from 'react'
import { DataTableCreateProgramInCurriculum } from './program-data-table-components/curriculum/create-curriculum/data-table-create-program-in-curriculum'
import { CreateProgramInCurriculumColumns } from './program-data-table-components/curriculum/create-curriculum/columns-create-program-in-curriculum'
import { Input } from '@/components/ui/input'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_PROGRAM_ADD_NEW_CURRICULUM } from '@/api/curriculum'
import { toast } from "sonner"
import Loading from '@/components/loading'
import { CircleCheck, CircleX } from 'lucide-react'

export default function CreateCurriculum() {
    const queryClient = useQueryClient()
    const [isreset, setReset] = useState<boolean>(false)
    const [programs, setPrograms] = useState<IAPIPrograms[]>([])
    const [hascurriculum, setCurriculum] = useState<string>('')
    const [dialogsubmit, setDialogSubmit] = useState<boolean>(false)
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })

    const handleFetchProgramsAdded = (e: IAPIPrograms[]) => {
        setPrograms(e)
    }

    const { mutateAsync: addcurriculum, isPending: addcurriculumLoading } = useMutation({
        mutationFn: API_PROGRAM_ADD_NEW_CURRICULUM,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogSubmit(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                toast("Uh, oh. Something went wrong!", { description: data.message })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['curriculums', 'curriculum_exists'] })
                await queryClient.refetchQueries({ queryKey: ['curriculums', 'curriculum_exists'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                toast("Yay, success! 🎉", { description: data.message })
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setDialogSubmit(false)
                setReset(true)
                setCurriculum('')
                return

            }
        },
        onError: (data) => {
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async () => {
        if (programs.length === 0 || hascurriculum === '') {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please fill-in the required fields.' })
            return
        }
        await addcurriculum({ name: hascurriculum, programs })
    }

    const isLoading = addcurriculumLoading

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
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
                    btnContinue={() => { setAlertDialogState(prev => ({ ...prev, show: false })) }}
                />
                <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <BackHeadSection />
                            <SubHeadSectionDetails
                                title="NEW CURRICULUM"
                                description="A page for creating a new curriculum."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Programs" link={ROUTES.AVAILABLE_PROGRAMS} />
                            <SidebarNavs title="Courses" link={ROUTES.AVAILABLE_COURSES} />
                            <SidebarNavs bg='bg-muted' title="Curriculums" link={ROUTES.CURRICULUM} />
                        </Sidebar>
                        <MainTable>
                            <div className="flex flex-col border gap-4 rounded-md px-4">
                                <div className="w-full py-3 border-b">
                                    <h1 className='text-text font-semibold text-lg'>Configuration</h1>
                                </div>
                                <div className="w-full flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <h1 className='text-[.83rem]'>Curriculum Name</h1>
                                        <Input
                                            disabled={addcurriculumLoading}
                                            value={hascurriculum}
                                            type='text'
                                            placeholder='eg. New Curriculum 2020'
                                            onChange={(e) => setCurriculum(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <DataTableCreateProgramInCurriculum
                                        columns={CreateProgramInCurriculumColumns}
                                        data={programs || []}
                                        fetchAddedPrograms={handleFetchProgramsAdded}
                                        isreset={isreset}
                                    />
                                </div>
                                <AlertDialogConfirmation
                                    isDialog={dialogsubmit}
                                    setDialog={(open) => setDialogSubmit(open)}
                                    type={`default`}
                                    disabled={isLoading}
                                    className='w-full my-3 py-5'
                                    variant={'default'}
                                    btnTitle="Create New Curriculum"
                                    title="Are you sure?"
                                    description={`This will create a new curriculum.`}
                                    btnContinue={handleSubmit}
                                />
                            </div>
                        </MainTable>
                    </main>
                </div>
            </div >
        </>
    )
}