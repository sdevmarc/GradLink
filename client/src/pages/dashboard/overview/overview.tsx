import HeadSection, { SubHeadSectionDetails } from "@/components/head-section";
import './index.css'
import { Combobox } from "@/components/combobox";
import { CircleCheck, CircleX, Eye, EyeOff, Filter, LoaderCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_PROGRAM_FINDALL } from "@/api/program";
import { API_STUDENT_YEARS_GRADUATED } from "@/api/student";
import { API_ANALYTICS_EMPLOYMENT } from "@/api/analytics";
import { PieChartLandJob } from "@/components/charts/pie-chart-land-job";
import { PieChartRelatedJob } from "@/components/charts/pie-chart-related-job";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/hooks/AuthContext";
import { AlertDialogConfirmation } from "@/components/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_USER_CHANGE_DEFAULT_PASSWORD, API_USER_CHECK_DEFAULT_PASSWORD } from "@/api/user";
import { Button } from "@/components/ui/button";

export default function Overview() {
    const queryClient = useQueryClient()
    const [dialogchangepassword, setDialogChangePassword] = useState<boolean>(false)
    const [program, setProgram] = useState<string>('')
    const [yearGraduated, setYearGraduated] = useState<string>('')
    const [department, setDepartment] = useState<string>('')
    const [filteredPrograms, setFilteredPrograms] = useState<{ label: string, value: string }[]>([])
    const [filteredYearsGraduated, setFilteredYearsGraduated] = useState<{ label: string, value: string }[]>([])
    const [password, setPassword] = useState<string>('')
    const [confirmpassword, setConfirmPassword] = useState<string>('')
    const { isAuthenticated } = useContext(AuthContext);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            // Redirect to login page if not authenticated
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate])

    const { data: checkpassword, isLoading: checkpasswordLoading, isFetched: checkpasswordFetched } = useQuery({
        queryFn: () => API_USER_CHECK_DEFAULT_PASSWORD(),
        queryKey: ['check-password']
    })

    useEffect(() => {
        if (checkpasswordFetched) {
            if (!checkpassword.success) {
                setDialogChangePassword(true)
            } else {
                setDialogChangePassword(false)
            }
        }
    }, [checkpassword])

    const { data: programs, isLoading: programsLoading, isFetched: programsFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['programs']
    })

    const { data: yearsGraduations, isLoading: yearsgraduateLoading, isFetched: yearsgraduatedFetched } = useQuery({
        queryFn: () => API_STUDENT_YEARS_GRADUATED(),
        queryKey: ['years']
    })

    const department_options = [
        { value: 'SEAIT', label: "Eng'g, Dev't. Arts & Design, Library Science & IT" },
        { value: 'SHANS', label: "Science and Mathematics" },
        { value: 'SAB', label: "Business and Accountancy" },
        { value: 'STEH', label: "Teacher Education and Humanities" }
    ]

    const { data: tracerresponse, isLoading: tracerresponseLoading, isFetched: tracerresponseFetched } = useQuery({
        queryFn: () => API_ANALYTICS_EMPLOYMENT({ department, program, academicYear: yearGraduated }),
        queryKey: ['analytics', { department, program, academicYear: yearGraduated }]
    })

    useEffect(() => {
        if (programsFetched) {
            const filteringprogram: { label: string, value: string }[] = programs?.data?.map((item: { _id: string, descriptiveTitle: string }) => {
                const { _id, descriptiveTitle } = item
                return { label: descriptiveTitle, value: _id }
            }) || []
            setFilteredPrograms(filteringprogram)
        }
    }, [programs])

    useEffect(() => {
        if (yearsgraduatedFetched) {
            const filteredYears: { label: string, value: string }[] = yearsGraduations?.data?.map((item: { academicYear: string }) => {
                const { academicYear } = item
                return { label: academicYear, value: academicYear }
            }) || []

            setFilteredYearsGraduated(filteredYears)
        }
    }, [yearsGraduations])


    const { mutateAsync: changepassword, isPending: changepasswordPending } = useMutation({
        mutationFn: API_USER_CHANGE_DEFAULT_PASSWORD,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogChangePassword(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                return
            } else {
                setDialogChangePassword(false)
                await queryClient.invalidateQueries({ queryKey: ['check-password'] })
                await queryClient.refetchQueries({ queryKey: ['check-password'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setPassword('')
                setConfirmPassword('')
                return
            }
        },
        onError: (data) => {
            setDialogChangePassword(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
            return
        }
    })

    const handleChangePassword = async () => {
        const nospaceNewPassword = (password ?? '').replace(/\s+/g, '')
        const nospaceConfirmPassword = (confirmpassword ?? '').replace(/\s+/g, '')

        if (nospaceNewPassword === '' || nospaceConfirmPassword === '') {
            setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: 'Please fill-in the required field.' })
            return
        }

        if (nospaceNewPassword !== nospaceConfirmPassword) {
            setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: 'Password do not match!' })
            return
        }

        setDialogChangePassword(false)
        await changepassword({ password })
        return
    }

    const isLoading = programsLoading || yearsgraduateLoading || tracerresponseLoading || checkpasswordLoading

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
                btnContinue={() => setAlertDialogState(prev => ({ ...prev, show: false }))}
            />
            <AlertDialogConfirmation
                isDialog={dialogchangepassword}
                setDialog={(e) => setDialogChangePassword(e)}
                type={`input`}
                disabled={changepasswordPending}
                variant={'default'}
                btnTitle="Change Password"
                title="Please change your default password"
                description={`This action will change your password.`}
                content={
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="newpassword">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    disabled={changepasswordPending}
                                    value={password}
                                    id="newpassword"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button
                                    disabled={changepasswordPending}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>

                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="confirmpassword">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    disabled={changepasswordPending}
                                    value={confirmpassword}
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmpassword"
                                    placeholder="Confirm Password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <Button
                                    disabled={changepasswordPending}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>

                        </div>
                    </div>
                }
                btnContinue={() => handleChangePassword()}
            />
            <div className="w-full flex flex-col min-h-screen items-center">
                <main className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title=" Overview"
                                description="A dashboard providing analytics and insights into alumni data, and trends."
                            />
                        </HeadSection>
                    </aside>
                    <div className="py-4 px-8 flex flex-col">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {
                                        isLoading &&
                                        <div className="flex items-center gap-2">
                                            <LoaderCircle className={`text-muted-foreground animate-spin`} size={18} />
                                            <h1 className="text-muted-foreground text-sm">
                                                Syncing
                                            </h1>
                                        </div>
                                    }
                                </div>

                                <div className="flex items-center justify-end gap-2">
                                    <Combobox
                                        btnTitleclassName="gap-2"
                                        icon={<Filter className="text-primary" size={15} />}
                                        className='w-[200px]'
                                        lists={department_options || []}
                                        placeholder={`Department`}
                                        setValue={(item) => setDepartment(item)}
                                        value={department || ''}
                                    />

                                    <Combobox
                                        btnTitleclassName="gap-2"
                                        icon={<Filter className="text-primary" size={15} />}
                                        className='w-[200px]'
                                        lists={filteredPrograms || []}
                                        placeholder={`Program`}
                                        setValue={(item) => setProgram(item)}
                                        value={program || ''}
                                    />

                                    <Combobox
                                        btnTitleclassName="gap-2"
                                        icon={<Filter className="text-primary" size={15} />}
                                        className='w-[150px]'
                                        lists={filteredYearsGraduated || []}
                                        placeholder={`Year Graduated`}
                                        setValue={(item) => setYearGraduated(item)}
                                        value={yearGraduated || ''}
                                    />
                                </div>
                            </div>

                            {
                                (!tracerresponseLoading && tracerresponseFetched) &&
                                    (tracerresponse?.data?.timeToLandJob?.length > 0 || tracerresponse?.data?.courseRelatedJob?.length > 0) ?
                                    <div className="flex items-center justify-evenly gap-2 flex-wrap">
                                        <PieChartLandJob data={tracerresponse?.data?.timeToLandJob} />
                                        <PieChartRelatedJob data={tracerresponse?.data?.courseRelatedJob} />
                                    </div>
                                    : <div className="pt-[7rem] pb-[1rem] flex justify-center items-center">
                                        <h1 className="text-md font-medium">
                                            No data is available.
                                        </h1>
                                    </div>
                            }
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}