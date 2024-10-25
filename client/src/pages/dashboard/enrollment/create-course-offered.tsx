import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { ROUTES } from '@/constants'
import MainTable from '@/components/main-table'
import { useState } from 'react'
import { CircleCheck, CircleX } from 'lucide-react'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import Loading from '@/components/loading'
import { useNavigate } from 'react-router-dom'
import { DataTableCreateCourseOffered } from './enrollment-data-table-components/create-courses-offered/data-table-create-course-offered.'
import { CreateCourseOfferedColumns } from './enrollment-data-table-components/create-courses-offered/columns-create-course-offered'
import { IAPICourse } from '@/interface/course.interface'
import { useQuery } from '@tanstack/react-query'
import { API_COURSE_FINDALL } from '@/api/courses'

export default function CreateCoursesOffered() {
    const navigate = useNavigate()
    const [checkcourses, setCheckCourses] = useState<IAPICourse[]>([])
    const [dialogsubmit, setDialogSubmit] = useState<boolean>(false)
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })

    const { data: courses, isLoading: coursesLoading, isFetched: coursesFetched } = useQuery({
        queryFn: () => API_COURSE_FINDALL(),
        queryKey: ['courses']
    })

    // const { mutateAsync: addprogram, isPending: addprogramLoading } = useMutation({
    //     mutationFn: API_PROGRAM_ADD_PROGRAM,
    //     onSuccess: async (data) => {
    //         if (!data.success) {
    //             setDialogSubmit(false)
    //             setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
    //             toast("Uh, oh. Something went wrong!", { description: data.message })
    //             return
    //         } else {
    //             await queryClient.invalidateQueries({ queryKey: ['programs'] })
    //             await queryClient.refetchQueries({ queryKey: ['programs'] })
    //             window.scrollTo({
    //                 top: 0,
    //                 behavior: 'smooth'
    //             })
    //             setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
    //             setReset(true)
    //             setDialogSubmit(false)
    //             toast("Yay, success! 🎉", { description: data.message })
    //             return
    //         }
    //     },
    //     onError: (data) => {
    //         setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
    //     }
    // })

    const handleSubmit = async () => {
        if (checkcourses.length === 0) {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please add at least one program to submit.' })
            return
        }
        const courseid = checkcourses.map(item => {
            return item._id
        })
        console.log(courseid)
        // await addprogram({ programs })
        setDialogSubmit(false)
    }

    const isLoading = coursesLoading

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


            <div className="flex flex-col min-h-screen items-center">
                {isLoading && <Loading />}
                <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <BackHeadSection />
                            <SubHeadSectionDetails
                                title="CREATE COURSES OFFERED"
                                description="A tool for creating courses offered."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs bg='bg-muted' title="Courses Offered" link={ROUTES.ENROLLMENT} />
                        </Sidebar>
                        <MainTable>
                            <div className="flex flex-col border gap-4 rounded-md">
                                <div className="w-full px-4 py-3 border-b">
                                    <h1 className='text-text font-semibold text-lg'>Configuration</h1>
                                </div>
                                <div className="px-4">
                                    {
                                        coursesFetched &&
                                        <DataTableCreateCourseOffered
                                            columns={CreateCourseOfferedColumns}
                                            data={courses?.data || []}
                                            fetchCourses={(e) => setCheckCourses(e)}
                                        />
                                    }

                                    <AlertDialogConfirmation
                                        isDialog={dialogsubmit}
                                        setDialog={(open) => setDialogSubmit(open)}
                                        type={`default`}
                                        disabled={isLoading}
                                        className='w-full my-3 py-5'
                                        variant={'default'}
                                        btnTitle="Add to courses offered"
                                        title="Are you sure?"
                                        description={`This will create a new set of courses offered and replace the current courses offered.`}
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