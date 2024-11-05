import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { useEffect, useState } from 'react'
import { CircleCheck, CircleX } from 'lucide-react'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import Loading from '@/components/loading'
import { useNavigate, useParams } from 'react-router-dom'
import { IAPICourse } from '@/interface/course.interface'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_STUDENT_EVALUATE_STUDENT, API_STUDENT_FINDALL_EVALUATEES_IN_COURSE } from '@/api/student'
import { DataTableEnrollStudent } from './enrollment-data-table-components/enroll-student/data-table-enroll-student'
import { EnrollStudentColumns } from './enrollment-data-table-components/enroll-student/columns-enroll-student'
import { Combobox } from '@/components/combobox'

export default function EvaluateStudent() {
    const queryClient = useQueryClient()
    const { id } = useParams()

    const navigate = useNavigate()
    const [courseid, setCourseId] = useState<string>('')
    const [checkstudents, setCheckStudents] = useState<IAPICourse[]>([])
    const [dialogsubmit, setDialogSubmit] = useState<boolean>(false)
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })
    const [isPass, setPass] = useState<string>('')
    const options = [
        { label: 'PASS', value: 'pass' },
        { label: 'FAIL', value: 'fail' },
        { label: 'INC', value: 'inc' },
        { label: 'DROP', value: 'drop' }
    ]

    useEffect(() => {
        if (id) {
            const jsonString = atob(id);
            const parsedObject = JSON.parse(jsonString);
            const theid = parsedObject.id
            setCourseId(theid)
        }
    }, [id, courseid])

    const { data: students, isLoading: studentLoading, isFetched: studentFetched } = useQuery({
        queryFn: () => API_STUDENT_FINDALL_EVALUATEES_IN_COURSE(courseid),
        queryKey: ['student-evaluatees', courseid],
        enabled: !!courseid
    })

    const { mutateAsync: evaluatestudent, isPending: evaluatestudentLoading } = useMutation({
        mutationFn: API_STUDENT_EVALUATE_STUDENT,
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
                await queryClient.invalidateQueries({ queryKey: ['student-evaluatees'] })
                await queryClient.refetchQueries({ queryKey: ['student-evaluatees'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setDialogSubmit(false)
                return
            }
        },
        onError: (data) => {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async () => {
        if (checkstudents.length === 0) {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please add at least one program to submit.' })
            return
        }
        if (id) {
            const jsonString = atob(id);
            const parsedObject = JSON.parse(jsonString);
            const courseid = parsedObject.id
            const studentid = checkstudents.map(item => item._id).filter((id): id is string => id !== undefined)
            await evaluatestudent({ id: studentid, course: courseid, ispass: isPass })
        }
    }

    const isLoading = studentLoading || evaluatestudentLoading

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
                                title="EVALUATE STUDENT"
                                description="A tool for evaluating students to the selected course."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex justify-end">
                        <MainTable>
                            <div className="flex flex-col border gap-4 rounded-md">
                                <div className="w-full px-4 py-3 border-b">
                                    <h1 className='text-text font-semibold text-lg'>Configuration</h1>
                                </div>
                                <div className="px-4 gap-4 flex flex-col">
                                    <div className="overflow-hidden max-w-[500px] flex flex-col gap-1">
                                        <h1 className="text-md font-medium">
                                            Status
                                        </h1>
                                        <Combobox
                                            className='w-[400px]'
                                            lists={options || []}
                                            placeholder={`None`}
                                            setValue={(item) => setPass(item)}
                                            value={isPass || ''}
                                        />
                                    </div>
                                    {
                                        studentFetched &&
                                        <DataTableEnrollStudent
                                            columns={EnrollStudentColumns}
                                            data={students?.data || []}
                                            fetchCourses={(e) => setCheckStudents(e)}
                                        />
                                    }

                                    <AlertDialogConfirmation
                                        isDialog={dialogsubmit}
                                        setDialog={(open) => setDialogSubmit(open)}
                                        type={`default`}
                                        disabled={isLoading}
                                        className='w-full my-3 py-5'
                                        variant={'default'}
                                        btnTitle="Evaluate student(s)"
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