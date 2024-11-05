import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { useState } from 'react'
import { CircleCheck, CircleX } from 'lucide-react'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import Loading from '@/components/loading'
import { useNavigate } from 'react-router-dom'
import { DataTableCreateCourseOffered } from './enrollment-data-table-components/create-courses-offered/data-table-create-course-offered.'
import { CreateCourseOfferedColumns } from './enrollment-data-table-components/create-courses-offered/columns-create-course-offered'
import { IAPICourse } from '@/interface/course.interface'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_COURSE_FINDALL } from '@/api/courses'
import { Combobox } from '@/components/combobox'
import { API_CREATE_COURSES_OFFERED } from '@/api/offered'

interface AcademicYear {
    label: string;
    value: string;
}

const generateAcademicYears = (count: number): AcademicYear[] => {
    const currentYear = new Date().getFullYear();
    const academicYear: AcademicYear[] = [];

    for (let i = 0; i < count; i++) {
        const yearStart = currentYear + i;
        const yearEnd = yearStart + 1;
        academicYear.push({
            label: `${yearStart} - ${yearEnd}`,
            value: `${yearStart} - ${yearEnd}`
        });
    }

    return academicYear;
};

export default function CreateCoursesOffered() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [checkcourses, setCheckCourses] = useState<IAPICourse[]>([])
    const [isValid, setValid] = useState<boolean>(false)
    const [hassemester, setSemester] = useState<string>('')
    const [hasacademicYear, setAcademicYear] = useState<string>('')
    const [dialogsubmit, setDialogSubmit] = useState<boolean>(false)
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })
    const semester = [
        { label: 'First Semester', value: '1' },
        { label: 'Second Semester', value: '2' },
        { label: 'Third Semester', value: '3' }
    ]

    const count = 6; // Current year + 5 future years
    const academicYear = generateAcademicYears(count);

    const { data: courses, isLoading: coursesLoading, isFetched: coursesFetched } = useQuery({
        queryFn: () => API_COURSE_FINDALL(),
        queryKey: ['courses']
    })

    const { mutateAsync: updatecoursesoffered, isPending: updatecoursesofferedLoading } = useMutation({
        mutationFn: API_CREATE_COURSES_OFFERED,
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
                await queryClient.invalidateQueries({ queryKey: ['programs'] })
                await queryClient.refetchQueries({ queryKey: ['programs'] })
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
        if (!hassemester) {
            setValid(false)
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please select a semester.' })
            return
        }

        if (!hasacademicYear) {
            setValid(false)
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please select the academic year.' })
            return
        }

        if (checkcourses.length === 0) {
            setValid(false)
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please add at least one course to submit.' })
            return
        }

        const [startDate, endDate] = hasacademicYear.split('-').map(year => year.trim());
        const courseid = checkcourses.map(item => item._id).filter((id): id is string => id !== undefined)

        await updatecoursesoffered({
            courses: courseid,
            semester: Number(hassemester),
            academicYear: {
                startDate: Number(startDate),
                endDate: Number(endDate)
            }
        })
    }

    const isLoading = coursesLoading || updatecoursesofferedLoading

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
                                title="CREATE COURSES OFFERED"
                                description="A tool for creating courses offered."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex justify-end">
                        <MainTable>

                            <div className="flex flex-col border gap-4 rounded-md">
                                <div className="w-full px-4 py-3 border-b">
                                    <h1 className='text-text font-semibold text-lg'>Configuration</h1>
                                </div>
                                <div className="flex flex-col gap-4 px-4">
                                    <div className="overflow-hidden max-w-[200px] flex flex-col gap-1">
                                        <h1 className="text-md font-medium">
                                            Semester
                                        </h1>
                                        <Combobox
                                            className='w-[200px]'
                                            lists={semester || []}
                                            placeholder={`None`}
                                            setValue={(item) => setSemester(item)}
                                            value={hassemester || ''}
                                        />
                                    </div>
                                    <div className="overflow-hidden max-w-[200px] flex flex-col gap-1">
                                        <h1 className="text-md font-medium">
                                            Academic Year
                                        </h1>
                                        <Combobox
                                            className='w-[150px]'
                                            lists={academicYear || []}
                                            placeholder={`None`}
                                            setValue={(item) => setAcademicYear(item)}
                                            value={hasacademicYear || ''}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-md font-medium">
                                            Choose courses
                                        </h1>
                                        {
                                            coursesFetched &&
                                            <DataTableCreateCourseOffered
                                                columns={CreateCourseOfferedColumns}
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