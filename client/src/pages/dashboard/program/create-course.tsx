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
import { CreateCourseColumns } from './program-data-table-components/courses/create-course/columns'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import Loading from '@/components/loading'
import { toast } from "sonner"
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
    const navigate = useNavigate()
    const [resetSelection, setResetSelection] = React.useState(false)
    const [dialogsubmit, setDialogSubmit] = React.useState<boolean>(false)
    const [isPre, setPre] = React.useState<boolean>(false)
    const [course, setCourse] = React.useState<IAPICourse>({
        code: 0,
        courseno: '',
        descriptiveTitle: '',
        units: '',
        prerequisites: [],
    })
    const [alertdialogstate, setAlertDialogState] = React.useState({
        show: false,
        title: '',
        description: '',
        success: false
    })

    const { data: dataCourse, isLoading: courseLoading, isFetched: courseFetched } = useQuery({
        queryFn: () => API_COURSE_FINDALL(),
        queryKey: ['courses']
    })

    const { mutateAsync: insertCourse, isPending: insertcoursePending } = useMutation({
        mutationFn: API_COURSE_CREATE,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogSubmit(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                toast("Uh, oh. Something went wrong!", { description: data.message })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['courses'] })
                await queryClient.refetchQueries({ queryKey: ['courses'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                toast("Yay, success! 🎉", { description: data.message })
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setDialogSubmit(false)
                setResetSelection(true)
                setPre(false)
                setCourse(prev => ({ ...prev, courseno: '', descriptiveTitle: '', prerequisites: [], units: '' }))
                return
            }
        },
        onError: (data) => {
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async () => {
        const { courseno, descriptiveTitle, units, prerequisites } = course
        const upperCourseno = (courseno ?? '').replace(/\s+/g, '').toUpperCase()
        if (upperCourseno === '' || !descriptiveTitle || !units) {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please fill-up the required fields.' })
            return
        }
        await insertCourse({ courseno: upperCourseno, descriptiveTitle, units, prerequisites })
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

    const isLoading = courseLoading || insertcoursePending

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
                    navigate(-1)
                    setAlertDialogState(prev => ({ ...prev, show: false }))
                }}
            />

            <div className="w-[80%] flex flex-col justify-start gap-4 rounded-lg border">
                <div className="w-full px-4 py-3 border-b">
                    <h1 className='text-text font-semibold text-lg'>Configuration</h1>
                </div>
                <div className="w-full py-2 flex flex-col justify-between">
                    <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-col px-4 gap-1">
                            <h1 className='text-[.83rem]'>Code</h1>
                            <Input
                                disabled={isLoading}
                                value={course.courseno}
                                name='code'
                                type='text'
                                placeholder='eg. 100'
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col px-4 gap-1">
                            <h1 className='text-[.83rem]'>Course Number</h1>
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
                            <h1 className='text-[.83rem]'>Descriptive Title</h1>
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
                            <h1 className='text-[.83rem]'>Units</h1>
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
                        {
                            !isPre &&
                            <div className="flex px-4">
                                <Button disabled={isLoading} variant={`outline`} size={`sm`} className="flex items-center gap-4" type="button" onClick={() => setPre(true)}>
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
                                            data={dataCourse.data?.courses || []} columns={CreateCourseColumns}
                                            fetchCheck={handleCourseChange}
                                            onCancel={(e) => setPre(e)}
                                            resetSelection={resetSelection}
                                            onResetComplete={() => setResetSelection(false)}
                                        />
                                    }
                                </div>
                            </div>
                        }


                        <AlertDialogConfirmation
                            isDialog={dialogsubmit}
                            setDialog={(open) => setDialogSubmit(open)}
                            type={`default`}
                            disabled={isLoading}
                            className='w-full my-3 py-5'
                            variant={'default'}
                            btnTitle="Add Course to Current Curriculum"
                            title="Are you sure?"
                            description={`This will add new programs to the current curriculum.`}
                            btnContinue={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}