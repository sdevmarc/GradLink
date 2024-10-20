import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { ROUTES } from '@/constants'
import MainTable from '@/components/main-table'
import { CreateProgramColumns } from './program-data-table-components/program/create-program/columns-create-program'
import { DataTableCreateProgram } from './program-data-table-components/program/create-program/data-table-create-program'
import { useEffect, useState } from 'react'
import { IAPIPrograms } from '@/interface/program.interface'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CircleCheck, CircleX } from 'lucide-react'
import { API_PROGRAM_ADD_PROGRAM } from '@/api/program'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import { toast } from "sonner"
import Loading from '@/components/loading'
import { useNavigate } from 'react-router-dom'
import { API_CURRICULUM_ISEXISTS } from '@/api/curriculum'

export default function CreateProgram() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [isreset, setReset] = useState<boolean>(false)
    const [programs, setPrograms] = useState<IAPIPrograms[]>([])
    const [dialogsubmit, setDialogSubmit] = useState<boolean>(false)
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })
    const [isForm, setForm] = useState<boolean>(false)

    const { data: iscurriculum, isLoading: iscurriculumLoading, isFetched: iscurriculumFetched } = useQuery({
        queryFn: () => API_CURRICULUM_ISEXISTS(),
        queryKey: ['curriculum_exists']
    })

    useEffect(() => {
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
                setForm(true)
            }
        }
    }, [iscurriculum])

    const fetchProgramsAdded = (e: IAPIPrograms[]) => {
        setPrograms(e)
    }

    const { mutateAsync: addprogram, isPending: addprogramLoading } = useMutation({
        mutationFn: API_PROGRAM_ADD_PROGRAM,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogSubmit(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                toast("Uh, oh. Something went wrong!", { description: data.message })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['programs'] })
                await queryClient.refetchQueries({ queryKey: ['programs'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setReset(true)
                setDialogSubmit(false)
                toast("Yay, success! 🎉", { description: data.message })
                return
            }
        },
        onError: (data) => {
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async () => {
        if (programs.length === 0) {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please add at least one program to submit.' })
            return
        }
        await addprogram({ programs })
        setDialogSubmit(false)
    }

    const isLoading = addprogramLoading || iscurriculumLoading

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
                    navigate(-1)
                }}
            />

            {
                isForm &&
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
                                    <div className="px-4">
                                        <DataTableCreateProgram
                                            columns={CreateProgramColumns}
                                            data={programs || []}
                                            fetchAddedPrograms={fetchProgramsAdded}
                                            isreset={isreset}
                                        />
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
                            </MainTable>
                        </main>
                    </div>
                </div>
            }
        </>
    )
}