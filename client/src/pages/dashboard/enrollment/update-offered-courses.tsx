import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { useContext, useEffect, useState } from 'react'
import { CircleCheck, CircleX } from 'lucide-react'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import Loading from '@/components/loading'
import { useNavigate } from 'react-router-dom'
import { IAPICourse } from '@/interface/course.interface'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_COURSE_FINDALL } from '@/api/courses'
import { API_UPDATE_COURSES_OFFERED } from '@/api/offered'
import { UpdateCourseOfferedColumns } from './enrollment-data-table-components/update-courses-offered/columns-update-course-offered'
import { DataTableUpdateCourseOffered } from './enrollment-data-table-components/update-courses-offered/data-table-update-course-offered.'
import { AuthContext } from '@/hooks/AuthContext'

export default function UpdateOfferedCourses() {
    const queryClient = useQueryClient()
    const [checkcourses, setCheckCourses] = useState<IAPICourse[]>([])
    const [isValid, setValid] = useState<boolean>(false)
    const [dialogsubmit, setDialogSubmit] = useState<boolean>(false)
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })

    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            // Redirect to login page if not authenticated
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate])

    const { data: courses, isLoading: coursesLoading, isFetched: coursesFetched } = useQuery({
        queryFn: () => API_COURSE_FINDALL(),
        queryKey: ['courses']
    })

    const { mutateAsync: updateofferedcourses, isPending: updateofferedcoursesLoading } = useMutation({
        mutationFn: API_UPDATE_COURSES_OFFERED,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogSubmit(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['courses-offered'] })
                await queryClient.refetchQueries({ queryKey: ['courses-offered'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setValid(true)
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setDialogSubmit(false)
                return
            }
        },
        onError: (data) => {
            setValid(false)
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async () => {
        if (checkcourses.length === 0) {
            setValid(false)
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please add at least one course to submit.' })
            return
        }

        const courseid = checkcourses.map(item => item._id).filter((id): id is string => id !== undefined)

        await updateofferedcourses({ courses: courseid })
    }

    const isLoading = coursesLoading || updateofferedcoursesLoading

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
                    if (isValid) return navigate(-1)
                }}
            />

            <div className="flex flex-col min-h-screen items-center">
                {isLoading && <Loading />}
                <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <BackHeadSection />
                            <SubHeadSectionDetails
                                title="Update Offered Courses"
                                description="A tool for updating courses offered."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex justify-end">
                        <MainTable>
                            <div className="flex flex-col border gap-4 rounded-md">
                                <div className="w-full px-4 py-3 border-b flex items-center gap-4">
                                    <h1 className='text-text font-semibold text-lg'>Update Offered Courses</h1>
                                </div>
                                <div className="flex flex-col gap-4 px-4">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-md font-medium">
                                            Choose courses
                                        </h1>
                                        {
                                            coursesFetched &&
                                            <DataTableUpdateCourseOffered
                                                columns={UpdateCourseOfferedColumns}
                                                data={courses?.data || []}
                                                fetchCourses={(e) => setCheckCourses(e)}
                                            />
                                        }
                                    </div>

                                    <AlertDialogConfirmation
                                        isDialog={dialogsubmit}
                                        setDialog={(open) => setDialogSubmit(open)}
                                        type={`default`}
                                        disabled={isLoading}
                                        className='w-full my-3 py-5'
                                        variant={'default'}
                                        btnTitle="Update offered courses"
                                        title="Are you sure?"
                                        description={`This will update a new set of courses offered and replace the current courses offered.`}
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