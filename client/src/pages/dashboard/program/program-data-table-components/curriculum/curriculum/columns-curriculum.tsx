"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SheetModal } from "@/components/sheet-modal"
import { useState } from "react"
import { Bookmark, TableOfContents } from "lucide-react"
import { BookOpen, Clock, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ICurriculum } from "@/interface/curriculum.interface"

export const CurriculumColumns: ColumnDef<ICurriculum>[] = [
    {
        id: "icon",
        cell: () => {
            return (
                <div className="w-0">
                    <Bookmark className="text-primary" size={18} />
                </div>
            )

        }
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-full normal-case">{row.getValue("name")}</div>
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "program",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Program" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-full capitalize">{row.getValue("program")}</div>
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize font-medium">
                        <Badge variant={row.getValue("isActive") === true ? "default" : "destructive"}>
                            {row.getValue("isActive") === true ? 'Active' : 'Legacy'}
                        </Badge>
                    </span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableColumnFilter: true,
        enableSorting: false
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date Created" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="w-full capitalize">{row.getValue("createdAt")}</div>
            )
        },
        enableColumnFilter: true,
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
        accessorKey: "programid",
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

            const {
                name,
                major,
                categories,
                isActive,
                program,
                department,
                totalOfUnits,
                residency,
                createdAt
            } = row.original

            const handleViewDetails = () => {
                setIsOpen(true)
            }

            const handleOpenChange = (open: boolean) => {
                setIsOpen(open)
            }
            return (
                <div className="flex justify-end">
                    <Button onClick={handleViewDetails} variant={`outline`} size={`sm`} className="flex items-center gap-2">
                        <TableOfContents className="text-primary" size={18} />  View Details
                    </Button>
                    <SheetModal
                        className="w-[60%] overflow-auto"
                        isOpen={isOpen}
                        onOpenChange={handleOpenChange}
                        title="Curriculum Details"
                        description="View details of the selected curriculum."
                        content={
                            <div className="flex flex-col min-h-screen items-center">
                                <div className="w-full max-w-[90rem] flex flex-col">
                                    <main className="flex justify-center items-center py-4">
                                        <div className="min-h-screen w-full max-w-[70rem]">
                                            <Card className="w-full mx-auto">
                                                <CardHeader>
                                                    <div className="flex justify-between items-start">
                                                        <div className="w-full">
                                                            <div className="flex items-center justify-between">
                                                                <CardTitle className="capitalize flex flex-col text-3xl font-bold">
                                                                    {name || 'No Name Available'}
                                                                    <span className="font-normal text-md">
                                                                        {major || null}
                                                                    </span>
                                                                </CardTitle>
                                                                <div className="flex flex-col items-center">
                                                                    <h1 className="text-muted-foreground font-medium text-sm">Date Created</h1>
                                                                    <span className="text-primary text-md font-semibold">
                                                                        {createdAt}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <CardDescription className="mt-2 flex flex-col gap-2">
                                                                <div className="flex gap-2">
                                                                    <Badge variant={isActive ? 'default' : 'destructive'} className="mr-2">
                                                                        {
                                                                            isActive ? 'Active' : 'Legacy'
                                                                        }
                                                                    </Badge>
                                                                    <span className="text-muted-foreground">
                                                                        {department === 'SEAIT' && "Eng'g, Dev't. Arts & Design, LIS & IT"}
                                                                        {department === 'SHANS' && "Science and Mathematics"}
                                                                        {department === 'STEH' && "Business and Accountancy"}
                                                                        {department === 'SAB' && "Teacher Education and Humanities"}  | {program}
                                                                        {/* {department || 'No Department Available'} | {program || 'No Program Available'} */}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <h1 className="text-primary font-semibold text-md">Date Created</h1>
                                                                    <span className="text-primary text-md font-semibold">
                                                                        {createdAt}
                                                                    </span>
                                                                </div>
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
                                                                <span>Credits: {totalOfUnits || 0}</span>
                                                            </div>
                                                        </div>
                                                    </section>

                                                    <section className="space-y-4">
                                                        {
                                                            categories?.map((item, i) => (
                                                                <div key={i} className="flex flex-col">
                                                                    <h3 className="font-medium text-md uppercase">
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