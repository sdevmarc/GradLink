"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header";
import { Check, CircleCheck, GraduationCap, Mail, TableOfContents } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SheetModal } from "@/components/sheet-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialogConfirmation } from "@/components/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, CircleDashed, CircleX, Loader } from "lucide-react";
import { CardDescription } from "@/components/ui/card";
import { IAPIStudents } from "@/interface/student.interface";
import { API_STUDENT_RESTORE_ALUMNI_FROM_TRASH } from "@/api/student";

const formatAnswer = (answer: string | Record<string, any> | null | undefined): React.ReactNode => {
    if (typeof answer === 'object' && answer !== null) {
        return (
            <ul className="list-disc pl-4 mt-2">
                {Object.entries(answer).map(([key, value], index) => (
                    <li key={index} className="text-sm">
                        {key}: {typeof value === 'string' ? value : JSON.stringify(value)}
                    </li>
                ))}
            </ul>
        );
    }
    return answer || 'None';
};

const formatQuestion = (question: string): string => {
    // Remove pattern like "1. ", "12. ", etc.
    return question.replace(/^\d+\.\s*/, '');
};

export const AlumniTrashColumns: ColumnDef<IAPIStudents>[] = [
    {
        id: "icon",
        cell: () => {
            return (
                <div className="w-0 px-1">
                    <GraduationCap className="text-primary" size={18} />
                </div>
            )

        }
    },
    {
        accessorKey: "idNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID No." className="text-primary flex items-center justify-start" />
        ),
        cell: ({ row }) => (
            <div className="flex justify-start items-center capitalize gap-4 ">
                <Badge variant={`default`}>
                    {row.getValue("idNumber") ? row.getValue("idNumber") : 'LEGACY'}
                </Badge>
            </div>
        )
    },
    {
        id: "fullname",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name and Email" className="text-primary flex justify-start items-center" />
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
                        {row.getValue("idNumber") ? row.getValue("programCode") : '---'}
                    </span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            const idNumber = row.getValue('idNumber');

            if (!idNumber) return false;
            return value.includes(row.getValue(id))
        },
        enableSorting: false,
    },
    {
        accessorKey: "academicYear",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Year Graduated" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span className="capitalize">
                        {row.getValue("idNumber") ? row.getValue("academicYear") : '---'}
                    </span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            const idNumber = row.getValue('idNumber');

            if (!idNumber) return false;
            return value.includes(row.getValue(id))
        },
        enableSorting: false,
    },
    {
        accessorKey: "program",
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
            const idNumber = row.getValue('idNumber');

            if (!idNumber) return false;
            return value.includes(row.getValue(id))
        },
        enableHiding: true,
        enableSorting: false,
    },
    {
        accessorKey: "department",
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
            const idNumber = row.getValue('idNumber');

            if (!idNumber) return false;
            return value.includes(row.getValue(id))
        },
        enableHiding: true,
        enableSorting: false,
    },
    {
        accessorKey: "currentJobLevel",
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableHiding: true,
        enableSorting: false,
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" className="text-primary flex items-center justify-start" />
        ),
        cell: ({ row }) => {
            console.log('The row: ', row)
            return (
                <div className="flex justify-start items-center capitalize gap-4 ">
                    <Badge variant={`default`}>
                        {row.getValue("email")}
                    </Badge>
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const queryClient = useQueryClient()
            const [isOpen, setIsOpen] = useState<boolean>(false)
            const [dialogrestore, setDialogRestore] = useState<boolean>(false)
            const [alertdialogstate, setAlertDialogState] = useState({
                show: false,
                title: '',
                description: '',
                success: false
            })

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
                generalInformation,
                employmentData,
            } = row.original

            const handleViewDetails = () => {
                setIsOpen(true)
            }

            const handleOpenChange = (open: boolean) => {
                setIsOpen(open)
            }

            const { mutateAsync: restorealumni, isPending: restorealumniLoading } = useMutation({
                mutationFn: API_STUDENT_RESTORE_ALUMNI_FROM_TRASH,
                onSuccess: async (data) => {
                    if (!data.success) {
                        setDialogRestore(false)
                        setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        })
                        return
                    } else {
                        await queryClient.invalidateQueries({ queryKey: ['alumnitrashed'] })
                        await queryClient.refetchQueries({ queryKey: ['alumnitrashed'] })
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        })
                        setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                        setDialogRestore(false)
                        return
                    }
                },
                onError: () => {
                    setDialogRestore(false)
                    return
                }
            })

            const handleRestore = async () => {
                if (_id) {
                    await restorealumni({ id: _id })
                }
            }

            const isLoading = restorealumniLoading

            return (
                <>
                    {/* {isLoading && <Loading />} */}
                    <div className="flex justify-end">
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

                        <div className="flex items-center gap-2">
                            <AlertDialogConfirmation
                                isDialog={dialogrestore}
                                setDialog={(open) => setDialogRestore(open)}
                                disabled={isLoading}
                                className="flex items-center gap-2"
                                type={`default`}
                                variant={'default'}
                                btnIcon={<Check className="text-primary-foreground" size={18} />}
                                btnTitle="Restore"
                                title="Are you sure?"
                                description={`This action will restore the alumni data, and will display in the alumni information.`}
                                btnContinue={handleRestore}
                            />
                            <Button onClick={handleViewDetails} variant={`outline`} size={`sm`} className="flex items-center gap-2">
                                <TableOfContents className="text-primary" size={18} />  View Profile
                            </Button>
                        </div>

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
                                                                    <CardTitle className="uppercase text-3xl font-bold flex flex-col gap-2">
                                                                        <div className="flex items-center gap-4">
                                                                            {lastname}, {firstname} {middlename}
                                                                        </div>
                                                                        <span className="font-normal text-md lowercase flex items-center gap-2">
                                                                            <Mail className="text-muted-foreground" size={18} /> {email || 'No valid Email'}
                                                                        </span>
                                                                    </CardTitle>
                                                                </div>
                                                                <CardDescription className="mt-2 flex items-center justify-between">
                                                                    <div className="flex items-center">
                                                                        <Badge variant="default" className="mr-2">
                                                                            {idNumber || 'No valid ID Number'}
                                                                        </Badge>
                                                                        {
                                                                            idNumber &&
                                                                            <span className="text-muted-foreground uppercase">
                                                                                {department === 'SEAIT' && "Eng'g, Dev't. Arts & Design, LIS & IT"}
                                                                                {department === 'SHANS' && "Science and Mathematics"}
                                                                                {department === 'STEH' && "Business and Accountancy"}
                                                                                {department === 'SAB' && "Teacher Education and Humanities"}  | {programCode} | {programName}
                                                                            </span>
                                                                        }
                                                                    </div>
                                                                </CardDescription>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    {
                                                        idNumber &&
                                                        <CardContent className="space-y-4">
                                                            <div className="w-full mx-auto">
                                                                <CardHeader className="px-0">
                                                                    <CardTitle className="text-xl">
                                                                        Bachelor's Degree Information
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="flex flex-wrap gap-4 px-0">
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
                                                                            {achievements?.examRating ? `${achievements?.examRating}%` : 'None'}
                                                                        </span>
                                                                    </div>

                                                                </CardContent>
                                                            </div>
                                                        </CardContent>
                                                    }
                                                </Card>
                                                {
                                                    ((generalInformation?.questions?.length ?? 0) > 0 || (employmentData?.questions?.length ?? 0) > 0) &&
                                                    <>
                                                        <Card className="w-full mx-auto">
                                                            <CardHeader>
                                                                <CardTitle className="text-xl font-bold flex flex-col uppercase">
                                                                    Alumni Information
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="">
                                                                <div className="w-full mx-auto">
                                                                    <CardHeader className="px-0 py-0">
                                                                        <CardTitle className="text-xl font-normal">
                                                                            General Information
                                                                        </CardTitle>
                                                                    </CardHeader>
                                                                    <CardContent className="flex flex-wrap gap-4 px-0">
                                                                        <Table>
                                                                            <TableHeader>
                                                                                <TableRow>
                                                                                    <TableHead className="w-[50px]">ID</TableHead>
                                                                                    <TableHead className="w-1/3">Question</TableHead>
                                                                                    <TableHead>Answer</TableHead>
                                                                                </TableRow>
                                                                            </TableHeader>
                                                                            <TableBody>
                                                                                {
                                                                                    generalInformation?.questions?.map((item, index) => (
                                                                                        <TableRow key={index} className="print:break-inside-avoid">
                                                                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                                                                            <TableCell>{formatQuestion(item.question)}</TableCell>
                                                                                            <TableCell>{formatAnswer(item.answer)}</TableCell>
                                                                                        </TableRow>
                                                                                    ))
                                                                                }
                                                                            </TableBody>
                                                                        </Table>

                                                                    </CardContent>
                                                                </div>
                                                                <div className="w-full mx-auto">
                                                                    <CardHeader className="px-0 py-0">
                                                                        <CardTitle className="text-xl font-normal">
                                                                            Employment Data
                                                                        </CardTitle>
                                                                    </CardHeader>
                                                                    <CardContent className="flex flex-wrap gap-4 px-0">
                                                                        <Table>
                                                                            <TableHeader>
                                                                                <TableRow>
                                                                                    <TableHead className="w-[50px]">ID</TableHead>
                                                                                    <TableHead className="w-1/3">Question</TableHead>
                                                                                    <TableHead>Answer</TableHead>
                                                                                </TableRow>
                                                                            </TableHeader>
                                                                            <TableBody>
                                                                                {
                                                                                    employmentData?.questions?.map((item, index) => (
                                                                                        <TableRow key={index} className="print:break-inside-avoid">
                                                                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                                                                            <TableCell>{formatQuestion(item.question)}</TableCell>
                                                                                            <TableCell>{formatAnswer(item.answer)}</TableCell>
                                                                                        </TableRow>
                                                                                    ))
                                                                                }
                                                                            </TableBody>
                                                                        </Table>

                                                                    </CardContent>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </>
                                                }
                                                {
                                                    idNumber &&
                                                    <Card className="w-full mx-auto">
                                                        <CardHeader>
                                                            <div className="w-full flex flex-col items-start gap-2">
                                                                <div className="w-full flex items-center justify-between">
                                                                    <h1 className="text-xl font-semibold">
                                                                        {programName}
                                                                    </h1>
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
                                                                                                PASSED
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
                                                                                                INCOMPLETE
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
                                                        </CardContent>
                                                    </Card>
                                                }
                                            </div>
                                        </main>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </>
            )
        }
    }
]