"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { IAPIOffered } from "@/interface/offered.interface"
import { Badge } from "@/components/ui/badge"
import { ChartColumnBig, TableOfContents } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SheetModal } from "@/components/sheet-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { API_STUDENT_FINDALL_ATTRITION_RATE_COURSES } from "@/api/student"

export const AttritionRateCoursestColumns: ColumnDef<IAPIOffered>[] = [
    {
        id: "icon",
        cell: () => {
            return (
                <div className="w-0">
                    <ChartColumnBig className="text-primary" size={18} />
                </div>
            )

        }
    },
    {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Code" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="flex justify-start items-center capitalize gap-4 ">
                <Badge variant={`default`}>
                    {row.getValue("code")}
                </Badge>
            </div>
        ),
        enableHiding: false
    },
    {
        accessorKey: "courseno",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Course No." className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-[100px] capitalize">{row.getValue("courseno")}</div>
        ),
        enableHiding: false
    },
    {
        accessorKey: "descriptiveTitle",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Descriptive Title" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[200px] truncate capitalize">
                        {row.getValue("descriptiveTitle")}
                    </span>
                </div>
            );
        }
    },
    {
        accessorKey: "units",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Units" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[60px] items-center">
                    <span className="capitalize">{row.getValue("units")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableColumnFilter: true
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
        id: "actions",
        cell: ({ row }) => {
            const [isOpen, setIsOpen] = useState<boolean>(false)
            const id = row.original._id || ''
            const code = row.original.code || ''
            const courseno = row.original.courseno || ''
            const descriptiveTitle = row.original.descriptiveTitle || ''

            const { data: courses, isLoading: coursesLoading, isFetched: coursesFetched } = useQuery({
                queryFn: () => API_STUDENT_FINDALL_ATTRITION_RATE_COURSES(id),
                queryKey: ['students', id],
                enabled: !!id
            })

            const handleViewDetails = () => {
                setIsOpen(true)
            }

            const handleOpenChange = (open: boolean) => {
                setIsOpen(open)
            }

            return (
                <div className="flex justify-end">
                    <Button onClick={handleViewDetails} variant={`outline`} size={`sm`} className="flex items-center gap-2">
                        <TableOfContents className="text-primary" size={18} /> View Attrition
                    </Button>
                    <SheetModal
                        className="w-[60%]"
                        isOpen={isOpen}
                        onOpenChange={handleOpenChange}
                        title="Course Details"
                        description="View details of the selected course."
                        content={
                            <div className="flex flex-col min-h-screen items-center">
                                <div className="w-full max-w-[90rem] flex flex-col">
                                    <main className="flex justify-center items-center py-4">
                                        <div className="min-h-screen w-full max-w-[70rem]">
                                            <Card className="w-full mx-auto">
                                                <CardHeader className="space-y-4">
                                                    <CardTitle className="capitalize text-3xl font-bold">
                                                        {descriptiveTitle || 'Invalid Descriptive Title'}
                                                    </CardTitle>
                                                    <CardDescription className="mt-2">
                                                        <Badge variant="default" className="mr-2">
                                                            {code || 'Inavlid Code'}
                                                        </Badge>
                                                        <span className="text-muted-foreground">
                                                            {courseno || 'Invalid Course Number'}
                                                        </span>
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-8">
                                                    <Tabs defaultValue="latest" className="w-full">
                                                        <TabsList className="bg-background">
                                                            <TabsTrigger value="latest">Latest Semester</TabsTrigger>
                                                            <TabsTrigger value="past3">Past 3 Semesters</TabsTrigger>
                                                            <TabsTrigger value="all">All Semester</TabsTrigger>
                                                        </TabsList>
                                                        {
                                                            !coursesLoading && coursesFetched &&
                                                            <>
                                                                <TabsContent value="latest">
                                                                    <div className="space-y-4">
                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Total Student Enrolled</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.latestSemester?.totalStudentsEnrolled || 0}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Passed</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.latestSemester?.totalStudentsPassed || 0}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Failed</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.latestSemester?.totalStudentsFailed || 0}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Dropped/Retake</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.latestSemester?.totalStudentsDropped || 0}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Dropped/Leave</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.latestSemester?.totalStudentsDiscontinued || 0}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="pt-4">
                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Attrition Rate for {courseno || "Can't resolve course."}</div>
                                                                            <div className="border rounded-lg p-3 text-right font-semibold">
                                                                                {courses?.data?.latestSemester?.attritionRate || 0.00} %
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TabsContent>
                                                                <TabsContent value="past3">
                                                                    <div className="space-y-4">
                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Total Student Enrolled</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.pastThreeSemesters?.totalStudentsEnrolled || 0}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Passed</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.pastThreeSemesters?.totalStudentsPassed || 0}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Failed</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.pastThreeSemesters?.totalStudentsFailed || 0}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Dropped/Retake</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.pastThreeSemesters?.totalStudentsDropped || 0}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Dropped/Leave</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.pastThreeSemesters?.totalStudentsDiscontinued || 0}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="pt-4">
                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Attrition Rate for {courseno || "Can't resolve course."}</div>
                                                                            <div className="border rounded-lg p-3 text-right font-semibold">
                                                                                {courses?.data?.pastThreeSemesters?.attritionRate || 0.00} %
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TabsContent>
                                                                <TabsContent value="all">
                                                                    <div className="space-y-4">
                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Total Student Enrolled</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.allSemesters?.totalStudentsEnrolled || 0}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Passed</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.allSemesters?.totalStudentsPassed || 0}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Failed</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.allSemesters?.totalStudentsFailed || 0}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Dropped/Retake</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.allSemesters?.totalStudentsDropped || 0}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Dropped/Leave</div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {courses?.data?.allSemesters?.totalStudentsDiscontinued || 0}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="pt-4">
                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="font-medium">Attrition Rate for {courseno || "Can't resolve course."}</div>
                                                                            <div className="border rounded-lg p-3 text-right font-semibold">
                                                                                {courses?.data?.allSemesters?.attritionRate || 0.00} %
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TabsContent>
                                                            </>
                                                        }
                                                    </Tabs>
                                                    <div className="pt-4 border-t">
                                                        <p className="text-sm text-muted-foreground mt-4 italic">
                                                            *Attrition rate = (Number of students who left / Total enrolled) x 100
                                                        </p>
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