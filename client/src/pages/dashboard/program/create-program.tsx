import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { ROUTES } from '@/constants'
import MainTable from '@/components/main-table'
import { CreateProgramColumns } from './program-data-table-components/program/create-program/columns-create-program'
import { DataTableCreateProgram } from './program-data-table-components/program/create-program/data-table-create-program'
import { useState } from 'react'
import { IAPIPrograms } from '@/interface/program.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import ContinueDialog from '@/components/continue-dialog'
import { CircleCheck, CircleX } from 'lucide-react'
import { API_PROGRAM_ADD_PROGRAM } from '@/api/program'
import Loading from '@/components/loading'
import { AlertDialogConfirmation } from '@/components/alert-dialog'

export default function CreateProgram() {
    const queryClient = useQueryClient()
    const [isreset, setReset] = useState<boolean>(false)
    const [programs, setPrograms] = useState<IAPIPrograms[]>([])
    const [dialogState, setDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })

    const fetchProgramsAdded = (e: IAPIPrograms[]) => {
        setPrograms(e)
    }

    const { mutateAsync: addprogram, isPending: programLoading } = useMutation({
        mutationFn: API_PROGRAM_ADD_PROGRAM,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
            } else {
                await queryClient.invalidateQueries({ queryKey: ['programs'] })
                await queryClient.refetchQueries({ queryKey: ['programs'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setDialogState({ success: true, show: true, title: data.message, description: 'Do you want to continue creating program?' })
                setReset(true)

            }
        },
        onError: (data) => {
            setDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async () => {
        if (programs.length === 0) return setDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please add at least one program to submit.' })
        await addprogram({ programs })
    }

    const isLoading = programLoading

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                {isLoading && <Loading />}
                <ContinueDialog
                    icon={dialogState.success ? <CircleCheck color="#42a626" size={70} /> : <CircleX color="#880808" size={70} />}
                    trigger={dialogState.show}
                    title={dialogState.title}
                    description={dialogState.description}
                    onClose={() => { setDialogState(prev => ({ ...prev, show: false })) }}
                />
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
                                <div className="px-4">
                                    <DataTableCreateProgram
                                        columns={CreateProgramColumns}
                                        data={programs || []}
                                        fetchAddedPrograms={fetchProgramsAdded}
                                        isreset={isreset}
                                    />
                                    <AlertDialogConfirmation
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
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}