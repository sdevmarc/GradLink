"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { IAPIPrograms } from "@/interface/program.interface"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RightSheetModal } from "@/components/right-sheet-modal"
import { Badge } from "@/components/ui/badge"
import { BookCopy, BookOpen, Clock, GraduationCap, TableOfContents } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const AvailableProgramsColumns: ColumnDef<IAPIPrograms>[] = [
    {
        id: "icon",
        cell: () => {
            return (
                <div className="w-0">
                    <BookCopy color="#000000" size={18} />
                </div>
            )

        }
    },
    {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Code" className="text-primary" />
        ),
        cell: ({ row }) => (
            <div className="flex justify-start items-center capitalize gap-4 ">
                <Badge variant={`default`}>
                    {row.getValue("code")}
                </Badge>
            </div>
        ),
        // enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "descriptiveTitle",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Descriptive Title" className="text-primary" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize">
                        {row.getValue("descriptiveTitle")}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "residency",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Residency" className="text-primary" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="capitalize">{row.getValue("residency")}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableColumnFilter: true
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

            const code = row?.original?.code || 'Invalid Code'
            const descriptiveTitle = row?.original?.descriptiveTitle || 'Invalid Descriptive Title'
            const residency = row?.original?.residency || 'Invalid Descriptive Title'
            const totalUnits = row?.original?.totalUnits || 0
            const { name, major, categories } = row?.original?.curriculum || {}

            // console.log(test)
            const handleViewDetails = () => {
                setIsOpen(true)
            }

            const handleOpenChange = (open: boolean) => {
                setIsOpen(open)
            }
            return (
                <div className="flex justify-end">
                    <Button onClick={handleViewDetails} variant={`outline`} size={`sm`} className="flex items-center gap-4">
                        <TableOfContents color="#000000" size={18} /> View Details
                    </Button>
                    <RightSheetModal
                        className="w-[60%]"
                        isOpen={isOpen}
                        onOpenChange={handleOpenChange}
                        title="Program Details"
                        description="View details of the selected program."
                        content={
                            <div className="flex flex-col min-h-screen items-center">
                                <div className="w-full max-w-[90rem] flex flex-col">
                                    <main className="flex justify-center items-center py-4">
                                        <div className="min-h-screen w-full max-w-[70rem]">
                                            <Card className="w-full mx-auto">
                                                <CardHeader>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="capitalize text-3xl font-bold flex flex-col">
                                                                {descriptiveTitle}
                                                                <span className="font-normal text-md">{major || null}</span>
                                                            </CardTitle>
                                                            <CardDescription className="mt-2">
                                                                <Badge variant="default" className="mr-2">
                                                                    {code}
                                                                </Badge>
                                                                <span className="text-muted-foreground">
                                                                    {name || 'No Curriculum'}
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
                                                                <span>Residency: {residency} years</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                                                                <span>Credits: {totalUnits}</span>
                                                            </div>
                                                        </div>
                                                    </section>

                                                    <section className="space-y-4">
                                                        {
                                                            categories?.map((item, i) => (
                                                                <div key={i} className="flex flex-col">
                                                                    <h3 className="font-medium text-md">
                                                                        {item.categoryName}
                                                                    </h3>
                                                                    {
                                                                        item?.courses?.map((course, l) => (
                                                                            <ul key={l} className="flex items-center gap-4 mt-2">
                                                                                <li className="w-full flex items-center justify-between text-sm">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <GraduationCap size={18} className="h-5 w-5 mr-2 text-muted-foreground" />
                                                                                        {(course as any)?.descriptiveTitle || 'No Title'}
                                                                                    </div>
                                                                                    <h1 className="flex items-center gap-2">
                                                                                        {(course as any)?.units || 0}<span>Units</span>
                                                                                    </h1>
                                                                                </li>
                                                                            </ul>
                                                                        ))
                                                                    }

                                                                </div>
                                                            ))
                                                        }

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