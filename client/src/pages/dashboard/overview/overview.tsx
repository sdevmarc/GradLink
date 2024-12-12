import HeadSection, { SubHeadSectionDetails } from "@/components/head-section";
import './index.css'
import { Combobox } from "@/components/combobox";
import { CircleCheck, CircleX, Eye, EyeOff, Filter, LoaderCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_PROGRAM_FINDALL } from "@/api/program";
import { API_STUDENT_YEARS_GRADUATED } from "@/api/student";
import { API_ANALYTICS_COMMON_REASONS, API_ANALYTICS_EMPLOYMENT } from "@/api/analytics";
import { PieChartLandJob } from "@/components/charts/pie-chart-land-job";
import { PieChartRelatedJob } from "@/components/charts/pie-chart-related-job";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/hooks/AuthContext";
import { AlertDialogConfirmation } from "@/components/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_USER_CHANGE_DEFAULT_PASSWORD, API_USER_CHECK_DEFAULT_PASSWORD } from "@/api/user";
import { Button } from "@/components/ui/button";
import { PieChartGraduated } from "@/components/charts/pie-chart-graduated";
import { BarChartCommonReasons } from "@/components/charts/bar-chart-common-reasons";
import { SheetModal } from "@/components/sheet-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Overview() {
    const queryClient = useQueryClient()
    const [isClickCell, setClickCell] = useState<boolean>(false)
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
    const [commonreason, setCommonReason] = useState<string>('')
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
        queryKey: ['checkpassword']
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

    const { data: coomonreasons, isLoading: coomonreasonsLoading, isFetched: coomonreasonsFetched } = useQuery({
        queryFn: () => API_ANALYTICS_COMMON_REASONS({ reason: commonreason }),
        queryKey: ['analytics', { reason: commonreason }]
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
                await queryClient.invalidateQueries({ queryKey: ['checkpassword'] })
                await queryClient.refetchQueries({ queryKey: ['checkpassword'] })
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

    const common_reasons_options = [
        { label: "Financial Difficulties", value: "Financial Difficulties" },
        { label: "Personal or Family Reasons", value: "Personal or Family Reasons" },
        { label: "Health Issues", value: "Health Issues" },
        { label: "Work or Career Commitments", value: "Work or Career Commitments" },
        { label: "Lack of Interest in the Program", value: "Lack of Interest in the Program" },
        { label: "Relocation or Moving", value: "Relocation or Moving" },
        { label: "Dissatisfaction with the Program", value: "Dissatisfaction with the Program" },
        { label: "Better Opportunities Elsewhere", value: "Better Opportunities Elsewhere" },
        { label: "Time Constraints", value: "Time Constraints" },
        { label: "Change in Career Goals", value: "Change in Career Goals" },
        { label: "Academic Challenges", value: "Academic Challenges" },
        { label: "Transfer to Another Institution", value: "Transfer to Another Institution" },
        { label: "Visa or Immigration Issues", value: "Visa or Immigration Issues" },
        { label: "Discrimination or Uncomfortable Environment", value: "Discrimination or Uncomfortable Environment" },
        { label: "Lack of Support from Faculty or Staff", value: "Lack of Support from Faculty or Staff" },
        { label: "Program Not Meeting Expectations", value: "Program Not Meeting Expectations" },
        { label: "Family Emergency", value: "Family Emergency" },
        { label: "Not Ready for Academic Rigor", value: "Not Ready for Academic Rigor" },
        { label: "Poor Mental Health", value: "Poor Mental Health" },
        { label: "Completion of Specific Goals", value: "Completion of Specific Goals" },
        { label: "Others", value: "Others" },
    ]

    const isLoading = programsLoading || yearsgraduateLoading || tracerresponseLoading || checkpasswordLoading || coomonreasonsLoading

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
            <SheetModal
                className="w-[60%] overflow-auto"
                isOpen={isClickCell}
                onOpenChange={(e: boolean) => setClickCell(e)}
                title="Respondent"
                description="View details of one of the respondents."
                content={
                    <div className="flex flex-col min-h-screen items-center">
                        <div className="w-full max-w-[90rem] flex flex-col">
                            <main className="flex justify-center items-center py-4">
                                <div className="min-h-screen w-full max-w-[70rem] flex flex-col gap-4">
                                    <>
                                        <Card className="w-full mx-auto">
                                            <CardHeader>
                                                <CardTitle className="text-xl font-bold flex flex-col uppercase">
                                                    Alumni Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-[100px]">ID</TableHead>
                                                            <TableHead className="w-1/3">Name</TableHead>
                                                            <TableHead className="w-1/3">Program</TableHead>
                                                            <TableHead className="w-1/3">Year Graduated</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <TableRow className="print:break-inside-avoid">
                                                            <TableCell className="font-medium">
                                                                43339254
                                                            </TableCell>
                                                            <TableCell>
                                                                REYES, LIZA SORIANO
                                                            </TableCell>
                                                            <TableCell>
                                                                ME
                                                            </TableCell>
                                                            <TableCell>
                                                                2024 - 2025
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow className="print:break-inside-avoid">
                                                            <TableCell className="font-medium">
                                                                69562545
                                                            </TableCell>
                                                            <TableCell>
                                                                SAN JOSE, JULIA MENDOZA
                                                            </TableCell>
                                                            <TableCell>
                                                                ME
                                                            </TableCell>
                                                            <TableCell>
                                                                2024 - 2025
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow className="print:break-inside-avoid">
                                                            <TableCell className="font-medium">
                                                                59545069
                                                            </TableCell>
                                                            <TableCell>
                                                                CRUZ, LINA CHUA
                                                            </TableCell>
                                                            <TableCell>
                                                                ME
                                                            </TableCell>
                                                            <TableCell>
                                                                2024 - 2025
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </>
                                </div>
                            </main>
                        </div>
                    </div>
                }
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

                            <div className="flex flex-col justify-center items-center gap-[10rem]">
                                {
                                    (!tracerresponseLoading && tracerresponseFetched) &&
                                        (tracerresponse?.data?.analytics?.timeToLandJob?.length > 0 || tracerresponse?.data?.analytics?.courseRelatedJob?.length > 0 || tracerresponse?.data?.graduateStats?.length > 0) ?
                                        <div className="w-full flex items-center justify-center gap-2 flex-wrap">
                                            <PieChartLandJob isClickCell={(e: boolean) => setClickCell(e)} data={tracerresponse?.data?.analytics?.timeToLandJob} />
                                            <PieChartGraduated isClickCell={(e: boolean) => setClickCell(e)} data={tracerresponse?.data?.graduateStats} />
                                            <PieChartRelatedJob isClickCell={(e: boolean) => setClickCell(e)} data={tracerresponse?.data?.analytics?.courseRelatedJob} />
                                        </div>
                                        :
                                        <div className="pt-[7rem] pb-[1rem] flex justify-center items-center">
                                            <h1 className="text-md font-medium">
                                                No data is available.
                                            </h1>
                                        </div>
                                }
                                <div className="w-full flex flex-col gap-4 items-start justify-start">
                                    <div className="w-full flex items-center justify-between">
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
                                                className='w-[300px]'
                                                lists={common_reasons_options || []}
                                                placeholder={`Reasons`}
                                                setValue={(item) => setCommonReason(item)}
                                                value={commonreason || ''}
                                            />
                                        </div>
                                    </div>
                                    {
                                        coomonreasonsFetched &&
                                            coomonreasons?.data?.length > 0 ?
                                            <BarChartCommonReasons data={coomonreasons?.data || []} />
                                            :
                                            <div className="w-full pt-[7rem] pb-[1rem] flex justify-center items-center">
                                                <h1 className="text-md font-medium">
                                                    No data is available.
                                                </h1>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}