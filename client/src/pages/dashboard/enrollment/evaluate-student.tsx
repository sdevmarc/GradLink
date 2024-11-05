import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { useEffect, useState } from 'react'
import { CircleCheck, CircleX } from 'lucide-react'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import Loading from '@/components/loading'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_STUDENT_EVALUATE_STUDENT, API_STUDENT_FINDALL_EVALUATEES_IN_COURSE } from '@/api/student'
import { DataTableEvaluateStudent } from './enrollment-data-table-components/evaluate-student/data-table-evaluate-student'
import { EvaluateStudentColumns } from './enrollment-data-table-components/evaluate-student/columns-evaluate-student'

interface Evaluation {
    id: string;
    status: string;
    file?: File | null;
    preview?: string | null; // URL for preview
}

export default function EvaluateStudent() {
    const queryClient = useQueryClient()
    const { id } = useParams()
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const navigate = useNavigate()
    const [courseid, setCourseId] = useState<string>('')
    const [dialogsubmit, setDialogSubmit] = useState<boolean>(false)
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })

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

    const handleEvaluationChange = (id: string, evaluationStatus: string) => {
        setEvaluations(prevEvaluations => {
            const existingIndex = prevEvaluations.findIndex(evaluation => evaluation.id === id);
            const updatedEvaluations = [...prevEvaluations];
            if (existingIndex >= 0) {
                updatedEvaluations[existingIndex] = { ...updatedEvaluations[existingIndex], status: evaluationStatus };
            } else {
                updatedEvaluations.push({ id, status: evaluationStatus });
            }
            return updatedEvaluations;
        });
    };

    const handleFileChange = (id: string, file: File | null) => {
        setEvaluations(prevEvaluations => {
            const existingIndex = prevEvaluations.findIndex(evaluation => evaluation.id === id);
            const updatedEvaluations = [...prevEvaluations];
            const preview = file ? URL.createObjectURL(file) : null; // Generate or clear preview URL

            if (existingIndex >= 0) {
                updatedEvaluations[existingIndex] = { ...updatedEvaluations[existingIndex], file, preview };
            } else {
                updatedEvaluations.push({ id, status: '', file, preview });
            }
            return updatedEvaluations;
        });
    };

    useEffect(() => {
        console.log('Tite: ', evaluations)
    }, [evaluations])

    const handleSubmit = async () => {
        // if (evaluations.length === 0) {
        //     setDialogSubmit(false)
        //     setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please add at least one program to submit.' })
        //     return
        // }
        if (id) {
            // const jsonString = atob(id);
            // const parsedObject = JSON.parse(jsonString);
            // const courseid = parsedObject.id
            setDialogSubmit(false)
            console.log('Tite: ', evaluations)

            // const studentid = checkstudents.map(item => item._id).filter((id): id is string => id !== undefined)
            // await evaluatestudent({ id: studentid, course: courseid, ispass: isPass })
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
                                    {
                                        studentFetched &&
                                        <DataTableEvaluateStudent
                                        columns={EvaluateStudentColumns(handleEvaluationChange, evaluations, handleFileChange)}
                                            data={students?.data || []}
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