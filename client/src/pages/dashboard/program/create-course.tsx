import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_COURSE_CREATE, API_COURSE_FINDALL } from '@/api/courses'
import { DataTableCreateCourse } from './program-data-table-components/courses/create-course/data-table-courses-create'
import { IAPICourse } from '@/interface/course.interface'
import React from 'react'
import { ROUTES } from '@/constants'
import { CircleCheck, CircleX, Plus } from 'lucide-react'
import { DataTableCreateProgramInCourse } from './program-data-table-components/program/create-program/sub/data-table-program-create'
import { CreateCourseColumns } from './program-data-table-components/courses/create-course/columns'
import { API_PROGRAM_FINDALL } from '@/api/program'
import { CreateProgramInCourseColumns } from './program-data-table-components/program/create-program/sub/columns'
import { IAPIPrograms } from '@/interface/program.interface'
import ContinueDialog from '@/components/continue-dialog'

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
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Programs" link={ROUTES.AVAILABLE_PROGRAMS} />
                            <SidebarNavs bg='bg-muted' title="Courses" link={ROUTES.AVAILABLE_COURSES} />
                            <SidebarNavs title="Curriculums" link={ROUTES.CURRICULUM} />
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
    const [resetSelection, setResetSelection] = React.useState(false)
    const [dialogState, setDialogState] = React.useState({
        show: false,
        title: '',
        description: '',
        success: false
    })
    const [isPre, setPre] = React.useState<boolean>(false)
    const [course, setCourse] = React.useState<IAPICourse>({
        courseno: '',
        descriptiveTitle: '',
        units: '',
        programs: [],
        prerequisites: [],
    })
    const { data: dataCourse, isLoading: courseLoading, isFetched: courseFetched } = useQuery({
        queryFn: () => API_COURSE_FINDALL(),
        queryKey: ['course']
    })

    const { data: dataProgram, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['program']
    })

    const { mutateAsync: insertCourse, isPending: insertcoursePending } = useMutation({
        mutationFn: API_COURSE_CREATE,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
            } else {
                await queryClient.invalidateQueries({ queryKey: ['courses'] })
                await queryClient.refetchQueries({ queryKey: ['courses'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setDialogState({ success: true, show: true, title: data.message, description: 'Do you want to continue creating course?' })
                setResetSelection(true)
                setPre(false)
                setCourse(prev => ({ ...prev, courseno: '', descriptiveTitle: '', degree: [], pre_req: [], units: '' }))
            }
        },
        onError: (data) => {
            setDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { courseno, descriptiveTitle, programs, units, prerequisites } = course
        if (!courseno?.trim() || !descriptiveTitle || (programs?.length ?? 0) <= 0 || !units) return alert('Please fill-up the required fields.')

        await insertCourse({ courseno, descriptiveTitle, programs, units, prerequisites })
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCourse((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCourseChange = (selectedCourses: IAPICourse[]) => {
        setCourse((prev) => ({
            ...prev,
            prerequisites: selectedCourses.map(({ _id }) => ({ _id: _id || '' }))
        }))
    }

    const handleProgramChange = (selectedPrograms: IAPIPrograms[]) => {
        setCourse((prev) => ({
            ...prev,
            programs: selectedPrograms.map(({ _id }) => ({ _id: _id || '' }))
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="w-[80%] flex flex-col justify-start gap-4 rounded-lg border">
            <ContinueDialog
                icon={dialogState.success ? <CircleCheck color="#42a626" size={70} /> : <CircleX color="#880808" size={70} />}
                trigger={dialogState.show}
                title={dialogState.title}
                description={dialogState.description}
                onClose={() => { setDialogState(prev => ({ ...prev, show: false })) }}
            />
            <div className="w-full px-4 py-3 border-b">
                <h1 className='text-text font-semibold text-lg'>Configuration</h1>
            </div>
            <div className="w-full py-2 flex flex-col justify-between">
                <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-col px-4 gap-1">
                        <h1 className='text-[.83rem]'>Course Number</h1>
                        <Input
                            disabled={insertcoursePending}
                            value={course.courseno}
                            name='courseno'
                            type='text'
                            placeholder='eg. LIS100'
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col px-4 gap-1">
                        <h1 className='text-[.83rem]'>Descriptive Title</h1>
                        <Input
                            disabled={insertcoursePending}
                            value={course.descriptiveTitle}
                            name='descriptiveTitle'
                            type='text'
                            placeholder='eg. Library Information System'
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col px-4 gap-1">
                        <h1 className='text-[.83rem]'>Units</h1>
                        <Input
                            disabled={insertcoursePending}
                            value={course.units}
                            name='units'
                            type='text'
                            placeholder='eg. 123'
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    {
                        !isPre &&
                        <div className="flex px-4">
                            <Button disabled={insertcoursePending} variant={`outline`} size={`sm`} className="flex items-center gap-4" type="button" onClick={() => setPre(true)}>
                                <Plus color="#000000" size={18} /> Add Prerequisite
                            </Button>
                        </div>
                    }

                    {
                        isPre &&
                        <div className="flex flex-col px-4 gap-2">
                            <div className="flex flex-col gap-1">
                                <h1 className='text-[1.1rem] font-medium'>
                                    Add Prerequisite
                                </h1>
                                <p className="text-sm">
                                    Please check the course(s) that is a prerequisite for this course.
                                </p>
                            </div>
                            <div className="w-full flex flex-col gap-2 justify-center items-start">
                                {courseLoading && <div>Loading...</div>}
                                {
                                    courseFetched &&
                                    <DataTableCreateCourse
                                        data={dataCourse.data || []} columns={CreateCourseColumns}
                                        fetchCheck={handleCourseChange}
                                        onCancel={(e) => setPre(e)}
                                        resetSelection={resetSelection}
                                        onResetComplete={() => setResetSelection(false)}
                                    />
                                }
                            </div>
                        </div>
                    }

                    <div className="flex flex-col px-4 gap-2">
                        <div className="flex flex-col gap-1">
                            <h1 className='text-[1.1rem] font-medium'>
                                Program's Available
                            </h1>
                            <p className="text-sm">
                                Please check the program(s) that you will place this course.
                            </p>
                        </div>
                        <div className="w-full flex flex-col gap-2 justify-center items-start">
                            {programLoading && <div>Loading...</div>}
                            {
                                programFetched &&
                                <DataTableCreateProgramInCourse
                                    data={dataProgram.data.programs || []}
                                    columns={CreateProgramInCourseColumns}
                                    fetchCheck={handleProgramChange}
                                    resetSelection={resetSelection}
                                    onResetComplete={() => setResetSelection(false)}
                                />
                            }
                        </div>
                    </div>
                    <Button disabled={insertcoursePending} type='submit' variant={`default`} size={`sm`} className='my-3 py-5'>
                        {insertcoursePending ? 'Creating course...' : 'Create a New Course'}
                    </Button>
                </div>
            </div>
        </form>
    )
}