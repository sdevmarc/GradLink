"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { IAPICourse } from '@/interface/course.interface'
import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RightSheetModal } from "@/components/right-sheet-modal"
import { BookOpen, Clock, GraduationCap, TableOfContents } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const AvailableCoursesColumns: ColumnDef<IAPICourse>[] = [
    {
        id: "icon",
        cell: () => {
            return (
                <div className="w-0">
                    <BookOpen color="#000000" size={18} />
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
                    <span className="capitalize"> {row.getValue("units")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableColumnFilter: true
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const [isOpen, setIsOpen] = useState<boolean>(false)

            const handleViewDetails = () => {
                setIsOpen(true)
            }

            const handleOpenChange = (open: boolean) => {
                setIsOpen(open)
            }
            return (
                <div className="flex justify-end">
                    <Button onClick={handleViewDetails} variant={`outline`} size={`sm`} className="flex items-center gap-4">
                        <TableOfContents color="#000000" size={18} />   View Details
                    </Button>
                    <RightSheetModal
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
                                                <CardHeader>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="capitalize text-3xl font-bold">
                                                                Master of Information Technology
                                                            </CardTitle>
                                                            <CardDescription className="mt-2">
                                                                <Badge variant="default" className="mr-2">
                                                                    MIT
                                                                </Badge>
                                                                <span className="text-muted-foreground">
                                                                    New Curriculum 2024
                                                                </span>
                                                            </CardDescription>
                                                        </div>
                                                        {/* <Button>Apply Now</Button> */}
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <section className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="flex items-center">
                                                                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                                                                <span>Residency: 3 years</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                                                                <span>Credits: 26</span>
                                                            </div>
                                                        </div>
                                                    </section>

                                                    <section className="space-y-4">
                                                        <div>
                                                            <h3 className="font-semibold text-lg">Courses</h3>
                                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                                                <li className="flex items-center">
                                                                    <GraduationCap className="h-5 w-5 mr-2 text-muted-foreground" />
                                                                    Data Analytics
                                                                </li>

                                                            </ul>
                                                        </div>
                                                    </section>
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

// function ViewDetails<TData>({ row }: DataTableRowActionsProps<TData>) {
//     const id = (row.original as any)._id

//     // const { data: program, isLoading: programLoading, isFetched: programFetched } = useQuery({
//     //     queryFn: () => API_PROGRAM_FINDONE({ _id: id ?? '' }),
//     //     queryKey: ['findone_program'],
//     //     enabled: !!id
//     // })

//     return (
//         <>
            
//         </>
//     )
// }