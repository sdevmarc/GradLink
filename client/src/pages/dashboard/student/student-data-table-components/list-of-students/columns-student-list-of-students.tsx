"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { IAPIStudents } from "@/interface/student.interface"
import { Button } from "@/components/ui/button"
import { SheetModal } from "@/components/sheet-modal"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CircleCheck, CircleDashed, CircleUserRound, CircleX, Loader, TableOfContents, UserPen } from "lucide-react"
import { BookOpen, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialogConfirmation } from "@/components/alert-dialog"

const dateRangeFilter = (row: any, columnId: string, filterValue: [Date, Date]) => {
    const cellDate = new Date(row.getValue(columnId));
    const [start, end] = filterValue;

    // Reset time part for accurate date comparison
    const startDate = new Date(start.setHours(0, 0, 0, 0));
    const endDate = new Date(end.setHours(23, 59, 59, 999));

    return cellDate >= startDate && cellDate <= endDate;
};

export const StudentListOfStudentsColumns: ColumnDef<IAPIStudents>[] = [
    {
        id: "icon",
        cell: () => {
            return (
                <div className="w-0">
                    <CircleUserRound className="text-primary" />
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
                    {row.getValue("idNumber")}
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
        id: "actions",
        cell: ({ row }) => {
            const [isOpen, setIsOpen] = useState<boolean>(false)
            const {
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
                achievements
            } = row.original

            const handleViewDetails = () => {
                setIsOpen(true)
            }

            const handleOpenChange = (open: boolean) => {
                setIsOpen(open)
            }
            return (
                <div className="flex justify-end">
                    <Button onClick={handleViewDetails} variant={`outline`} size={`sm`} className="flex items-center gap-4">
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
                                                        <div>
                                                            <CardTitle className="uppercase text-3xl font-bold flex flex-col">
                                                                {lastname}, {firstname} {middlename}
                                                                <span className="font-normal text-md lowercase">
                                                                    {email || 'No valid Email'}
                                                                </span>
                                                            </CardTitle>
                                                            <CardDescription className="mt-2 flex items-center justify-between">
                                                                <div className="flex items-center">
                                                                    <Badge variant="default" className="mr-2">
                                                                        {idNumber || 'No valid ID Number'}
                                                                    </Badge>
                                                                    <span className="text-muted-foreground">
                                                                        {department} | {programCode} | {programName}
                                                                    </span>
                                                                </div>
                                                                {/* <h1>
                                                                    Status:
                                                                    <span>
                                                                        {status === '' &&}
                                                                    </span>
                                                                </h1> */}

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
                                                                    {achievements?.examRating ? `${achievements?.examRating}%` : 'None'}
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
                                                                className="flex items-center gap-2"
                                                                type={`default`}
                                                                variant={'outline'}
                                                                btnIcon={<UserPen className="text-primary" size={18} />}
                                                                btnTitle="New Student"
                                                                title="Are you sure?"
                                                                description={`You will be redirect to page for creating new student.`}
                                                                btnContinue={handleViewDetails}
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
                                                        <table className="w-full ">
                                                            <thead>
                                                                <tr className="border-b">
                                                                    <th className="text-left font-normal pb-2">Course No.</th>
                                                                    <th className="text-left font-medium pb-2">Descriptive Title</th>
                                                                    <th className="text-left font-medium pb-2">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {enrolledCourses?.map((item, i) => (
                                                                    <tr key={i} className="border-b last:border-0">
                                                                        <td className="py-2">
                                                                            <span className="capitalize text-sm font-normal flex items-center gap-2">
                                                                                <GraduationCap size={18} className="h-5 w-5 text-muted-foreground" />
                                                                                {item.courseno}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-2">
                                                                            <span className="capitalize text-sm font-normal flex items-center gap-2">
                                                                                {item.descriptiveTitle}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-2 text-left text-medium">
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
                                                                                    item.status === 'not_taken' &&
                                                                                    <div className="flex items-center gap-2">
                                                                                        <CircleDashed className="text-primary" size={18} />
                                                                                        Not taken yet
                                                                                    </div>
                                                                                }
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
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
            )
        }
    }
]