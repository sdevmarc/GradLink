"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { IAPIStudents } from "@/interface/student.interface"
import { Button } from "@/components/ui/button"
import { SheetModal } from "@/components/sheet-modal"
import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CircleCheck, CircleDashed, CircleUserRound, CircleX, Download, Loader, Mail, Printer, ShieldCheck, TableOfContents, Upload, UserPen, X } from "lucide-react"
import { BookOpen, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { API_STUDENT_ACTIVATE_STUDENT, API_STUDENT_DISCONTINUE_STUDENT, API_STUDENT_UPDATE_STUDENT_SHIFT_STUDENT } from "@/api/student"
import PrintableComponent from "@/pages/dashboard/student/student-printable-component"
import { useReactToPrint } from 'react-to-print';

const dateRangeFilter = (row: any, columnId: string, filterValue: [Date, Date]) => {
    const cellDate = new Date(row.getValue(columnId));
    const [start, end] = filterValue;

    // Reset time part for accurate date comparison
    const startDate = new Date(start.setHours(0, 0, 0, 0));
    const endDate = new Date(end.setHours(23, 59, 59, 999));

    return cellDate >= startDate && cellDate <= endDate;
};

const formatExamRating = (rating: string | number | undefined): string => {
    if (!rating) return 'None';
    // Remove any non-digit characters except decimal point
    const numericRating = String(rating).replace(/[^\d.]/g, '');
    return `${numericRating}%`;
};

export const StudentListOfStudentsColumns: ColumnDef<IAPIStudents>[] = [
    {
        id: "icon",
        cell: () => {
            return (
                <div className="w-0 px-1">
                    <CircleUserRound className="text-primary" />
                </div>
            )

        }
    },
    {
        accessorKey: "idNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID No." className="text-primary flex items-center justify-start  transition-colors" />
        ),
        cell: ({ row }) => (
            <div className="flex justify-start items-center capitalize gap-4">
                <Badge variant={`default`}>
                    {row.getValue("idNumber")}
                </Badge>
            </div>
        )
    },
    {
        id: "fullname",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name and Email" className="text-primary flex justify-start items-center " />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex flex-col items-start justify-center">
                    <span className="flex items-center uppercase font-medium text-sm justify-end">
                        {row.getValue("lastname")},  {row.getValue("firstname")} {row.getValue("middlename")}
                    </span>
                    <span className="flex items-center lowercase font-normal text-[.7rem] justify-end">
                        {row.getValue("email")}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        filterFn: "includesString"
    },
    {
        accessorKey: "lastname",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Name" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize">
                        {row.getValue("lastname")}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        filterFn: "includesString"
    },
    {
        accessorKey: "firstname",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="First Name" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize">
                        {row.getValue("firstname")}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        filterFn: "includesString"
    },
    {
        accessorKey: "middlename",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Middle Name" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize">
                        {
                            row.getValue("middlename") ? row.getValue("middlename") : '[ No Middlename ]'
                        }
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[100px] truncate lowercase">
                        {row.getValue("email")}
                    </span>
                </div>
            )
        },
        enableSorting: false,
    },
    {
        accessorKey: "programCode",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Program" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span className="capitalize">
                        {row.getValue("programCode")}
                    </span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableSorting: false,
    },
    {
        id: "units",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Units Earned" className="text-text flex items-center justify-center" />
        ),
        cell: ({ row }) => {
            const totalEnrolled = row.original.totalOfUnitsEnrolled;
            const totalEarned = row.original.totalOfUnitsEarned;
            return (
                <div className="flex items-center justify-center">
                    <span className="flex uppercase">
                        {totalEarned} / {totalEnrolled}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "program",
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableHiding: true,
        enableSorting: false,
    },
    {
        accessorKey: "department",
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableHiding: true,
        enableSorting: false,
    },
    {
        accessorKey: "createdAt",
        enableColumnFilter: true,
        filterFn: dateRangeFilter,
        enableHiding: true,
        enableSorting: false,
    },
    {
        accessorKey: "status",
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableHiding: true,
        enableSorting: false,
    },
    {
        accessorKey: "isresidencylapsed",
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableHiding: true,
        enableSorting: false,
    },
    // {
    //     accessorKey: 'search',
    //     header: 'Search',
    //     filterFn: (row, columnId, filterValue) => {
    //         const id = row.getValue('id');
    //         const lastName = row.getValue('lastName');
    //         return (id as string).includes(filterValue) || lastName.toLowerCase().includes(filterValue.toLowerCase());
    //     },
    // },
    {
        id: "actions",
        cell: ({ row }) => {
            const queryClient = useQueryClient()
            const navigate = useNavigate()
            const printableRef = useRef<HTMLDivElement>(null);
            const [dialogshiftprogram, setDialogShiftProgram] = useState<boolean>(false)
            const [dialogprint, setDialogPrint] = useState<boolean>(false)
            const [dialogisshift, setDialogIsShift] = useState<boolean>(false)
            const [dialogupdate, setDialogUpdate] = useState<boolean>(false)
            const [dialogactivate, setDialogActivate] = useState<boolean>(false)
            const [dialogdiscontinue, setDialogDiscontinue] = useState<boolean>(false)
            const [isDiscontinue, setDiscontinue] = useState<boolean>(false)
            const [disconLoading, setDisconLoading] = useState<boolean>(false)
            const [isOpen, setIsOpen] = useState<boolean>(false)
            const [selectedProgram, setSelectedProgram] = useState('')
            const [formattedPrograms, setFormattedPrograms] = useState([])
            const {
                _id,
                idNumber,
                lastname,
                firstname,
                middlename,
                email,
                totalOfUnitsEnrolled,
                totalOfUnitsEarned,
                enrolledCourses,
                programName,
                programCode,
                department,
                undergraduateInformation,
                achievements,
                isenrolled,
                currentResidency,
                assessment
            } = row.original

            const [values, setValues] = useState({
                id: _id || '',
                previewAssessment: '',
                assessmentFile: null as File | null,
            })

            const { data: userdata, isLoading: userdataLoading, isFetched: userdataFetched } = useQuery({
                queryFn: () => API_USER_GET_USER(),
                queryKey: ['users']
            })

            const { data: curriculum, isLoading: curriculumLoading, isFetched: curriculumFetched } = useQuery({
                queryFn: () => API_CURRICULUM_FINDALL_ACTIVE(),
                queryKey: ['curriculums']
            })

            useEffect(() => {
                if (curriculumFetched && curriculum?.data) {
                    const formatCurriculum = curriculum.data.map((item: ICurriculum) => ({
                        value: item._id,
                        label: item.program
                    }))
                    setFormattedPrograms(formatCurriculum)
                }
            }, [curriculum, curriculumFetched])

            const handleNavigateUpdateStudent = () => {
                const base64ID = _id ? btoa(_id) : ''

                navigate(`/student/details/${base64ID}`)
            }

            const handleViewDetails = () => {
                setIsOpen(true)
            }

            const handleOpenChange = (open: boolean) => {
                setIsOpen(open)
            }

            interface IAssessmentReasons {
                academicChallenges: boolean;
                financialDifficulties: boolean;
                personalFamily: boolean;
                healthIssues: boolean;
                workCommitments: boolean;
                lackOfInterest: boolean;
                relocation: boolean;
                programDissatisfaction: boolean;
                betterOpportunities: boolean;
                timeConstraints: boolean;
                careerGoals: boolean;
                transfer: boolean;
                visaIssues: boolean;
                discrimination: boolean;
                lackOfSupport: boolean;
                programExpectations: boolean;
                familyEmergency: boolean;
                mentalHealth: boolean;
                specificGoals: boolean;
                other: boolean;
                otherText?: string;
            }

            const reasonsList = [
                { key: 'academicChallenges', label: 'Academic Challenges' },
                { key: 'financialDifficulties', label: 'Financial Difficulties' },
                { key: 'personalFamily', label: 'Personal or Family Reasons' },
                { key: 'healthIssues', label: 'Health Issues' },
                { key: 'workCommitments', label: 'Work or Career Commitments' },
                { key: 'lackOfInterest', label: 'Lack of Interest in the Program' },
                { key: 'relocation', label: 'Relocation or Moving' },
                { key: 'programDissatisfaction', label: 'Dissatisfaction with the Program' },
                { key: 'betterOpportunities', label: 'Better Opportunities Elsewhere' },
                { key: 'timeConstraints', label: 'Time Constraints' },
                { key: 'careerGoals', label: 'Change in Career Goals' },
                { key: 'transfer', label: 'Transfer to Another Institution' },
                { key: 'visaIssues', label: 'Visa or Immigration Issues' },
                { key: 'discrimination', label: 'Discrimination or Uncomfortable Environment' },
                { key: 'lackOfSupport', label: 'Lack of Support from Faculty or Staff' },
                { key: 'programExpectations', label: 'Program Not Meeting Expectations' },
                { key: 'familyEmergency', label: 'Family Emergency' },
                { key: 'mentalHealth', label: 'Poor Mental Health' },
                { key: 'specificGoals', label: 'Completion of Specific Goals' },
                // 'other' is handled separately
            ];

            const hasAssessmentReasons = assessment && assessment.reasons;

            const selectedReasons = hasAssessmentReasons
                ? [
                    ...reasonsList.filter(
                        (reason) => assessment?.reasons[reason.key as keyof IAssessmentReasons]
                    ),
                    ...(assessment?.reasons.other && assessment?.reasons.otherText
                        ? [{ key: 'other', label: assessment.reasons.otherText }]
                        : []),
                ]
                : [];


            // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            //     const file = e.target.files?.[0] || null;
            //     setValues(prev => ({
            //         ...prev,
            //         previewAssessment: file ? URL.createObjectURL(file) : '',
            //         assessmentFile: file
            //     }));
            // };

            const { mutateAsync: activateStudent, isPending: activatestudentLoading } = useMutation({
                mutationFn: API_STUDENT_ACTIVATE_STUDENT,
                onSuccess: async (data) => {
                    if (!data.success) {
                        setDialogActivate(false)
                        setDiscontinue(false)
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        })
                        return
                    } else {
                        await queryClient.invalidateQueries({ queryKey: ['students'] })
                        await queryClient.refetchQueries({ queryKey: ['students'] })
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        })
                        setDialogActivate(false)
                        setDiscontinue(false)
                        setValues(prev => ({ ...prev, assessmentFile: null, previewAssessment: '' }))
                        return
                    }
                },
                onError: () => {
                    setDialogActivate(false)
                    setDiscontinue(false)
                    return
                }
            })

            const { mutateAsync: shiftStudent, isPending: shiftStudentLoading } = useMutation({
                mutationFn: API_STUDENT_UPDATE_STUDENT_SHIFT_STUDENT,
                onSuccess: async (data) => {
                    if (!data.success) {
                        setDialogShiftProgram(false)
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        })
                        return
                    } else {
                        await queryClient.invalidateQueries({ queryKey: ['students'] })
                        await queryClient.refetchQueries({ queryKey: ['students'] })
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        })
                        setDialogShiftProgram(false)
                        setSelectedProgram('')
                        setValues(prev => ({ ...prev, assessmentFile: null, previewAssessment: '' }))
                        return
                    }
                },
                onError: () => {
                    return
                }
            })

            const handleProgramChange = (value: string) => {
                setSelectedProgram(value)
                // Add any additional logic you need when program changes
            }

            const handleShiftStudent = async () => {
                console.log('The selected program: ', selectedProgram)
                await shiftStudent({ id: _id || '', idNumber: idNumber || '', program: selectedProgram })
            }

            const handleActivateStudent = async () => {
                await activateStudent({ id: values.id })
            }

            const handleDownload = async () => {
                try {
                    // Fetch the image
                    if (!assessment?.assessmentForm) {
                        throw new Error('Assessment form URL is undefined');
                    }
                    if (typeof assessment?.assessmentForm !== 'string') {
                        throw new Error('Assessment form URL is undefined or not a string');
                    }
                    const response = await fetch(assessment.assessmentForm);
                    const blob = await response.blob();

                    // Create a blob URL
                    const blobUrl = window.URL.createObjectURL(blob);

                    // Create a link element
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `Assessment Form - ${lastname}, ${firstname} ${middlename}.png`// or whatever extension your image has

                    // Required for Firefox
                    document.body.appendChild(link);

                    // Trigger download
                    link.click();

                    // Cleanup
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                } catch (error) {
                    console.error('Download failed:', error);
                    // You might want to add some error handling UI here
                }
            };

            const handlePrint = useReactToPrint({
                documentTitle: `${idNumber} - ${lastname}, ${firstname} ${middlename || ''}`,
                contentRef: printableRef,
                onAfterPrint: () => setDialogPrint(false),

            });

            const isLoading = userdataLoading || disconLoading || activatestudentLoading || curriculumLoading || shiftStudentLoading

            return (
                <>
                    {
                        userdataFetched &&
                        <div className="flex justify-end gap-2">
                            <PrintableComponent
                                ref={printableRef}
                                lastname={lastname || ''}
                                firstname={firstname || ''}
                                middlename={middlename || ''}
                                email={email || ''}
                                idNumber={idNumber || ''}
                                department={department || ''}
                                programCode={programCode || ''}
                                programName={programName || ''}
                                totalOfUnitsEarned={totalOfUnitsEarned || 0}
                                totalOfUnitsEnrolled={totalOfUnitsEnrolled || 0}
                                enrolledCourses={enrolledCourses || []}
                            />

                            {
                                (userdata?.data?.role === 'root' || userdata?.data?.role === 'admin') &&
                                <AlertDialogConfirmation
                                    isDialog={dialogupdate}
                                    disabled={isLoading}
                                    setDialog={(e) => setDialogUpdate(e)}
                                    className="flex items-center gap-2"
                                    type={`default`}
                                    variant={`destructive`}
                                    btnIcon={<UserPen className="text-white" size={18} />}
                                    btnTitle={'Update Profile'}
                                    title="Are you sure?"
                                    description={`This will update the student, ${lastname}, ${firstname} ${middlename} information.`}
                                    btnContinue={() => {
                                        setDialogUpdate(false)
                                        handleNavigateUpdateStudent()
                                    }}
                                />
                            }

                            <Button onClick={handleViewDetails} variant={`outline`} size={`sm`} className="flex items-center gap-2">
                                <TableOfContents className="text-primary" size={18} />   View Profile
                            </Button>
                            <SheetModal
                                className="w-[60%] overflow-auto"
                                isOpen={isOpen}
                                onOpenChange={handleOpenChange}
                                title="Student Details"
                                description="View details of the selected student."
                                content={
                                    <div className="flex flex-col min-h-screen items-center">
                                        <div className="w-full max-w-[90rem] flex flex-col">
                                            <main className="flex justify-center items-center py-4">
                                                <div className="min-h-screen w-full max-w-[70rem] flex flex-col gap-4">
                                                    <Card className="w-full mx-auto">
                                                        <CardHeader>
                                                            <div className="flex justify-between items-start">
                                                                <div className="w-full flex flex-col">
                                                                    <div className="w-full flex items-center justify-between">
                                                                        <CardTitle className="uppercase text-3xl font-bold flex flex-col">
                                                                            {lastname}, {firstname} {middlename}
                                                                            <span className="font-normal text-md lowercase flex items-center gap-2">
                                                                                <Mail className="text-muted-foreground" size={18} /> {email || 'No valid Email'}
                                                                            </span>
                                                                        </CardTitle>
                                                                        <div className="flex flex-col gap">
                                                                            <div className="flex items-center gap-2">
                                                                                <AlertDialogConfirmation
                                                                                    isDialog={dialogprint}
                                                                                    setDialog={(e) => setDialogPrint(e)}
                                                                                    className="flex items-center gap-2"
                                                                                    type={`default`}
                                                                                    disabled={isLoading}
                                                                                    variant={'outline'}
                                                                                    btnIcon={<Printer className="text-primary" size={18} />}
                                                                                    btnTitle="Print Enrollments"
                                                                                    title="Are you sure?"
                                                                                    description={`This action will print the enrollments of ${lastname}, ${firstname} ${middlename}.`}
                                                                                    btnContinue={() => handlePrint()}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <CardDescription className="mt-2 flex flex-col gap-2">
                                                                        <div className="flex items-center">
                                                                            <Badge variant="default" className="mr-2">
                                                                                {idNumber || 'No valid ID Number'}
                                                                            </Badge>
                                                                            <span className="text-muted-foreground uppercase">
                                                                                {department === 'SEAIT' && "Eng'g, Dev't. Arts & Design, LIS & IT"}
                                                                                {department === 'SHANS' && "Science and Mathematics"}
                                                                                {department === 'STEH' && "Business and Accountancy"}
                                                                                {department === 'SAB' && "Teacher Education and Humanities"}  | {programCode} | {programName}
                                                                            </span>
                                                                        </div>
                                                                        {
                                                                            currentResidency &&
                                                                            <div className="flex items-center">
                                                                                <h1 className="text-primary font-medium">
                                                                                    Residency: <span>{currentResidency}</span>
                                                                                </h1>
                                                                            </div>
                                                                        }
                                                                    </CardDescription>
                                                                </div>
                                                                {/* <Button>Apply Now</Button> */}
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="space-y-4">
                                                            <div className="w-full mx-auto">
                                                                <CardHeader>
                                                                    <CardTitle className="text-xl">Bachelor's Degree Information</CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="flex flex-wrap gap-4">
                                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                                        <span className="text-md font-semibold">
                                                                            College/University
                                                                        </span>
                                                                        <span className="text-md font-normal">
                                                                            {undergraduateInformation?.college || 'None'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                                        <span className="text-md font-semibold">
                                                                            School
                                                                        </span>
                                                                        <span className="text-md font-normal">
                                                                            {undergraduateInformation?.school || 'None'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                                        <span className="text-md font-semibold">
                                                                            Program
                                                                        </span>
                                                                        <span className="text-md font-normal">
                                                                            {undergraduateInformation?.programGraduated || 'None'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                                        <span className="text-md font-semibold">
                                                                            Year Graduated
                                                                        </span>
                                                                        <span className="text-md font-normal">
                                                                            {undergraduateInformation?.yearGraduated || 'None'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                                        <span className="text-md font-semibold">
                                                                            Honors/Awards Received
                                                                        </span>
                                                                        <span className="text-md font-normal">
                                                                            {achievements?.awards || 'None'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                                        <span className="text-md font-semibold">
                                                                            Professional Exam Passed
                                                                        </span>
                                                                        <span className="text-md font-normal">
                                                                            {achievements?.examPassed || 'None'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                                        <span className="text-md font-semibold">
                                                                            Professional Exam Date
                                                                        </span>
                                                                        <span className="text-md font-normal">
                                                                            {achievements?.examDate || 'None'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                                        <span className="text-md font-semibold">
                                                                            Professional Exam Rating
                                                                        </span>
                                                                        <span className="text-md font-normal">
                                                                            {achievements?.examRating ? `${formatExamRating(achievements?.examRating)}` : 'None'}
                                                                        </span>
                                                                    </div>

                                                                </CardContent>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className="w-full mx-auto">
                                                        <CardHeader>
                                                            <div className="w-full flex flex-col items-start gap-2">
                                                                <div className="w-full flex items-center justify-between">
                                                                    <h1 className="text-xl font-semibold">
                                                                        {programName}
                                                                    </h1>
                                                                    <AlertDialogConfirmation
                                                                        isDialog={dialogshiftprogram}
                                                                        setDialog={(e) => setDialogShiftProgram(e)}
                                                                        type={`input`}
                                                                        disabled={isLoading}
                                                                        variant={'default'}
                                                                        btnIcon={<ShieldCheck className="text-primary" size={18} />}
                                                                        btnTitle="Shift to this program"
                                                                        title="Are you sure?"
                                                                        description={`${lastname}, ${firstname} ${middlename} will shift its program.`}
                                                                        content={
                                                                            <Combobox
                                                                                className="w-[300px]"
                                                                                lists={formattedPrograms}
                                                                                placeholder="Select program"
                                                                                value={selectedProgram}
                                                                                setValue={handleProgramChange}
                                                                            />
                                                                        }
                                                                        btnContinue={() => {
                                                                            handleShiftStudent()

                                                                        }}
                                                                    />
                                                                    <AlertDialogConfirmation
                                                                        isDialog={dialogisshift}
                                                                        setDialog={(e) => setDialogIsShift(e)}
                                                                        className="flex items-center gap-2"
                                                                        type={`default`}
                                                                        disabled={isLoading}
                                                                        variant={'outline'}
                                                                        btnIcon={<ShieldCheck className="text-primary" size={18} />}
                                                                        btnTitle="Shift Program"
                                                                        title="Are you sure?"
                                                                        description={`${lastname}, ${firstname} ${middlename} will shift its program.`}
                                                                        btnContinue={() => {
                                                                            setDialogIsShift(false)
                                                                            setDialogShiftProgram(true)
                                                                        }}
                                                                    />

                                                                </div>

                                                                <div className="w-full flex items-center justify-between">
                                                                    <h1 className="text-lg font-medium flex items-center gap-2">
                                                                        Courses:
                                                                    </h1>
                                                                    <div className="flex items-center">
                                                                        <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                                                                        <span>Credits: {totalOfUnitsEarned} / {totalOfUnitsEnrolled}</span>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="space-y-4">
                                                            <div className="flex flex-col">
                                                                <Table className="w-full ">
                                                                    <TableHeader>
                                                                        <TableRow className="border-b">
                                                                            <TableHead className="text-left font-normal pb-2">Course No.</TableHead>
                                                                            <TableHead className="text-left font-medium pb-2">Descriptive Title</TableHead>
                                                                            <TableHead className="text-left font-medium pb-2">Status</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {enrolledCourses?.map((item, i) => (
                                                                            <TableRow key={i} className="border-b last:border-0">
                                                                                <TableCell className="py-2">
                                                                                    <span className="capitalize text-sm font-normal flex items-center gap-2">
                                                                                        <GraduationCap size={18} className="h-5 w-5 text-muted-foreground" />
                                                                                        {item.courseno}
                                                                                    </span>
                                                                                </TableCell>
                                                                                <TableCell className="py-2">
                                                                                    <span className="capitalize text-sm font-normal flex items-center gap-2">
                                                                                        {item.descriptiveTitle}
                                                                                    </span>
                                                                                </TableCell>
                                                                                <TableCell className="py-2 text-left text-medium">
                                                                                    <span className="text-sm font-normal flex items-center gap-2 capitalize ">
                                                                                        {
                                                                                            item.status === 'ongoing' &&
                                                                                            <div className="flex items-center gap-2">
                                                                                                <Loader className="text-primary" size={18} />
                                                                                                Ongoing
                                                                                            </div>
                                                                                        }
                                                                                        {
                                                                                            item.status === 'pass' &&
                                                                                            <div className="flex items-center gap-2">
                                                                                                <CircleCheck className="text-primary" size={18} />
                                                                                                Passed
                                                                                            </div>
                                                                                        }
                                                                                        {
                                                                                            item.status === 'fail' &&
                                                                                            <div className="flex items-center gap-2">
                                                                                                <CircleX className="text-primary" size={18} />
                                                                                                Failed
                                                                                            </div>
                                                                                        }
                                                                                        {
                                                                                            item.status === 'inc' &&
                                                                                            <div className="flex items-center gap-2">
                                                                                                <CircleX className="text-primary" size={18} />
                                                                                                Incomplete
                                                                                            </div>
                                                                                        }
                                                                                        {
                                                                                            item.status === 'discontinue' &&
                                                                                            <div className="flex items-center gap-2">
                                                                                                <CircleX className="text-primary" size={18} />
                                                                                                Discontinued
                                                                                            </div>
                                                                                        }
                                                                                        {
                                                                                            item.status === 'drop' &&
                                                                                            <div className="flex items-center gap-2">
                                                                                                <CircleX className="text-primary" size={18} />
                                                                                                Dropped
                                                                                            </div>
                                                                                        }
                                                                                        {
                                                                                            item.status === 'not_taken' &&
                                                                                            <div className="flex items-center gap-2">
                                                                                                <CircleDashed className="text-primary" size={18} />
                                                                                                Not taken yet
                                                                                            </div>
                                                                                        }
                                                                                    </span>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                            <div className="flex flex-col gap-4">
                                                                {
                                                                    !isenrolled &&
                                                                    <AlertDialogConfirmation
                                                                        isDialog={dialogactivate}
                                                                        setDialog={(e) => setDialogActivate(e)}
                                                                        className="flex items-center gap-2"
                                                                        type={`default`}
                                                                        disabled={isLoading}
                                                                        variant={'outline'}
                                                                        btnIcon={<ShieldCheck className="text-primary" size={18} />}
                                                                        btnTitle="Re-Activate Student"
                                                                        title="Are you sure?"
                                                                        description={`${lastname}, ${firstname} ${middlename} will be re-activated if this continue.`}
                                                                        btnContinue={handleActivateStudent}
                                                                    />
                                                                }
                                                                {
                                                                    // !settings?.data?.isenroll &&
                                                                    (isenrolled && !isDiscontinue) &&
                                                                    <AlertDialogConfirmation
                                                                        isDialog={dialogdiscontinue}
                                                                        disabled={userdataLoading || disconLoading}
                                                                        setDialog={(e) => setDialogDiscontinue(e)}
                                                                        className="flex items-center gap-2"
                                                                        type={`default`}
                                                                        variant={`${!isDiscontinue ? 'destructive' : 'default'}`}
                                                                        btnIcon={<UserPen className="text-white" size={18} />}
                                                                        btnTitle={'Mark as Discontinue'}
                                                                        title="Are you sure?"
                                                                        description={`${lastname}, ${firstname} ${middlename} will be mark as a dicontinuing student, and its courses this semester will be mark as drop.`}
                                                                        btnContinue={() => {
                                                                            setDialogDiscontinue(false),
                                                                                setDiscontinue(true)
                                                                        }}
                                                                    />
                                                                }

                                                                {
                                                                    (!isenrolled) &&
                                                                    <div className="w-full flex items-center justify-center">
                                                                        <Card className="w-full flex flex-col items-center gap-2">
                                                                            <CardHeader>
                                                                                <CardTitle className="text-2xl font-bold">
                                                                                    Assessment Form
                                                                                </CardTitle>
                                                                            </CardHeader>
                                                                            <CardContent>
                                                                                {
                                                                                    assessment?.assessmentForm ? <img src={assessment?.assessmentForm} alt="Assessment form" className="w-full h-full object-cover" />
                                                                                        : 'No Assessment Form Available'
                                                                                }
                                                                            </CardContent>
                                                                            {assessment?.assessmentForm && (
                                                                                <CardFooter>
                                                                                    <Button
                                                                                        onClick={handleDownload}
                                                                                        className="flex items-center gap-2"
                                                                                    >
                                                                                        <Download className="w-4 h-4" />
                                                                                        Download Form
                                                                                    </Button>
                                                                                </CardFooter>
                                                                            )}
                                                                        </Card>
                                                                    </div>
                                                                }
                                                                {
                                                                    (!isenrolled) &&
                                                                    <div className="w-full flex items-center justify-center">
                                                                        <Card className="w-full flex flex-col items-center gap-2">
                                                                            <CardHeader>
                                                                                <CardTitle className="text-2xl font-bold">
                                                                                    Withdrawal Reasons
                                                                                </CardTitle>
                                                                            </CardHeader>
                                                                            <CardContent className="w-full flex items-center justify-start">
                                                                                <Table className="w-full">
                                                                                    <TableHeader>
                                                                                        <TableRow className="border-b">
                                                                                            <TableHead className="text-left font-medium pb-2 w-12">No.</TableHead>
                                                                                            <TableHead className="text-left font-medium pb-2">Reason(s)</TableHead>
                                                                                        </TableRow>
                                                                                    </TableHeader>
                                                                                    <TableBody>
                                                                                        {(selectedReasons.length > 0 && assessment?.reasons) ? (
                                                                                            selectedReasons.map((reason, i) => (
                                                                                                <TableRow key={reason.key} className="border-b last:border-0">
                                                                                                    <TableCell className="w-12">{i + 1}.</TableCell>
                                                                                                    <TableCell>
                                                                                                        {reason.key === 'other' ? (
                                                                                                            <span className="capitalize">Others: {reason.label}</span>
                                                                                                        ) : (
                                                                                                            reason.label
                                                                                                        )}
                                                                                                    </TableCell>
                                                                                                </TableRow>
                                                                                            ))
                                                                                        ) : (
                                                                                            <TableRow>
                                                                                                <TableCell colSpan={2} className="text-center">
                                                                                                    No reasons provided.
                                                                                                </TableCell>
                                                                                            </TableRow>
                                                                                        )}
                                                                                    </TableBody>
                                                                                </Table>
                                                                            </CardContent>

                                                                        </Card>
                                                                    </div>
                                                                }

                                                                {isDiscontinue &&
                                                                    <DragDropImage
                                                                        id={_id || ''}
                                                                        isDiscontinue={(e) => setDiscontinue(e)}
                                                                        isdiscontinueLoading={(e) => setDisconLoading(e)}
                                                                        isDialogSubmit={(e) => setDialogDiscontinue(e)}
                                                                    />}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </main>
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    }
                </>
            )
        }
    }
]

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { useNavigate } from "react-router-dom"
import { API_USER_GET_USER } from "@/api/user"
import { Combobox } from "@/components/combobox"
import { API_CURRICULUM_FINDALL_ACTIVE } from "@/api/curriculum"
import { ICurriculum } from "@/interface/curriculum.interface"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface ReasonState {
    financialDifficulties: boolean;
    personalFamily: boolean;
    healthIssues: boolean;
    workCommitments: boolean;
    lackOfInterest: boolean;
    relocation: boolean;
    programDissatisfaction: boolean;
    betterOpportunities: boolean;
    timeConstraints: boolean;
    careerGoals: boolean;
    academicChallenges: boolean;
    transfer: boolean;
    visaIssues: boolean;
    discrimination: boolean;
    lackOfSupport: boolean;
    programExpectations: boolean;
    familyEmergency: boolean;
    academicRigor: boolean;
    mentalHealth: boolean;
    specificGoals: boolean;
    other: boolean;
    otherText: string;
}

const reasonsList = [
    { id: 'financialDifficulties', label: 'Financial Difficulties' },
    { id: 'personalFamily', label: 'Personal or Family Reasons' },
    { id: 'healthIssues', label: 'Health Issues' },
    { id: 'workCommitments', label: 'Work or Career Commitments' },
    { id: 'lackOfInterest', label: 'Lack of Interest in the Program' },
    { id: 'relocation', label: 'Relocation or Moving' },
    { id: 'programDissatisfaction', label: 'Dissatisfaction with Program' },
    { id: 'betterOpportunities', label: 'Better Opportunities Elsewhere' },
    { id: 'timeConstraints', label: 'Time Constraints' },
    { id: 'careerGoals', label: 'Change in Career Goals' },
    { id: 'academicChallenges', label: 'Academic Challenges' },
    { id: 'transfer', label: 'Transfer to Another Institution' },
    { id: 'visaIssues', label: 'Visa or Immigration Issues' },
    { id: 'discrimination', label: 'Discrimination or Uncomfortable Environment' },
    { id: 'lackOfSupport', label: 'Lack of Support' },
    { id: 'programExpectations', label: 'Program Not Meeting Expectations' },
    { id: 'familyEmergency', label: 'Family Emergency' },
    { id: 'academicRigor', label: 'Not Ready for Academic Rigor' },
    { id: 'mentalHealth', label: 'Poor Mental Health' },
    { id: 'specificGoals', label: 'Completion of Specific Goals' },
    { id: 'other', label: 'Others' }
];

const DragDropImage = ({ id, isDiscontinue, isdiscontinueLoading, isDialogSubmit }: { id: string, isDiscontinue: (e: boolean) => void, isdiscontinueLoading: (e: boolean) => void, isDialogSubmit: (e: boolean) => void }) => {
    const queryClient = useQueryClient()
    const [image, setImage] = useState<File | null>(null)
    const [dialogsubmit, setDialogSubmit] = useState<boolean>(false)
    const [reasons, setReasons] = useState<ReasonState>({
        financialDifficulties: false,
        personalFamily: false,
        healthIssues: false,
        workCommitments: false,
        lackOfInterest: false,
        relocation: false,
        programDissatisfaction: false,
        betterOpportunities: false,
        timeConstraints: false,
        careerGoals: false,
        academicChallenges: false,
        transfer: false,
        visaIssues: false,
        discrimination: false,
        lackOfSupport: false,
        programExpectations: false,
        familyEmergency: false,
        academicRigor: false,
        mentalHealth: false,
        specificGoals: false,
        other: false,
        otherText: ''
    });

    const { mutateAsync: discontinueStudent, isPending: discontinueStudentLoading } = useMutation({
        mutationFn: async (formData: FormData) => API_STUDENT_DISCONTINUE_STUDENT(formData),
        onSuccess: async (data) => {
            if (!data.success) {
                isDialogSubmit(false)
                isDiscontinue(false)
                isdiscontinueLoading(false)
                setDialogSubmit(false)
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['students'] })
                await queryClient.refetchQueries({ queryKey: ['students'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                isDialogSubmit(false)
                isDiscontinue(false)
                isdiscontinueLoading(false)
                setDialogSubmit(false)
                setImage(null)
                return
            }
        },
        onError: () => {
            isDiscontinue(false)
            isDialogSubmit(false)
            setDialogSubmit(false)
            isdiscontinueLoading(false)
            return
        }
    })

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setImage(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif"],
        },
        multiple: false,
    })

    const removeImage = () => {
        setImage(null)
    }

    const handleDiscontinueStudent = async () => {
        if (!image) return;
        const formData = new FormData();
        formData.append("id", id);
        formData.append("reasons", JSON.stringify(reasons));
        formData.append("assessmentForm", image);

        await discontinueStudent(formData);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center p-4 gap-4">
            <h1 className="text-2xl font-bold">Assessment Form</h1>
            <Card className="w-full">
                <CardContent className="pt-6">
                    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"}`} >
                        <input {...getInputProps()} />
                        {image ? (
                            <div className="relative">
                                <img src={URL.createObjectURL(image)} alt="Uploaded" className="max-w-full h-auto rounded-lg" />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeImage()
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">Drag and drop an image here, or click to select a file</p>
                            </div>
                        )}
                    </div>
                    {!image && (
                        <p className="mt-2 text-xs text-center text-gray-500">
                            Supported formats: JPEG, JPG, PNG, GIF
                        </p>
                    )}
                </CardContent>
            </Card>
            <div className="w-full flex flex-col gap-2 items-center justify-center">
                <h1 className="text-2xl font-bold">Withdrawal Reasons</h1>
                <Card className="w-full">
                    <CardContent className="grid grid-cols-2 gap-4 pt-4">
                        {reasonsList.map((reason) => (
                            <div key={reason.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={reason.id}
                                    checked={!!reasons[reason.id as keyof ReasonState]}
                                    onCheckedChange={(checked) =>
                                        setReasons(prev => ({ ...prev, [reason.id]: checked as boolean }))
                                    }
                                />
                                <Label htmlFor={reason.id}>{reason.label}</Label>
                            </div>
                        ))}
                        {reasons.other && (
                            <div className="col-span-2">
                                <Input
                                    placeholder="Please specify other reason"
                                    value={reasons.otherText}
                                    onChange={(e) => setReasons(prev => ({ ...prev, otherText: e.target.value }))}
                                    className="mt-2"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="w-full flex flex-col gap-2">
                <AlertDialogConfirmation
                    isDialog={dialogsubmit}
                    disabled={discontinueStudentLoading}
                    setDialog={(e) => setDialogSubmit(e)}
                    className="flex items-center gap-2"
                    type={`default`}
                    variant={'default'}
                    btnIcon={<UserPen className="text-white" size={18} />}
                    btnTitle={`${!isDiscontinue ? 'Mark as Discontinue' : 'Submit Assessment'}`}
                    title="Are you sure?"
                    description={`The student will be mark as a dicontinuing student, and its courses this semester will be mark as drop.`}
                    btnContinue={() => handleDiscontinueStudent()}
                />
                <Button onClick={
                    (e) => {
                        e.stopPropagation()
                        removeImage()
                        isDiscontinue(false)
                    }
                } variant={`outline`} size={`sm`} className="flex items-center gap-4" type="button">
                    <X className='text-primary' size={18} /> Cancel
                </Button>
            </div>
        </div>
    )
}