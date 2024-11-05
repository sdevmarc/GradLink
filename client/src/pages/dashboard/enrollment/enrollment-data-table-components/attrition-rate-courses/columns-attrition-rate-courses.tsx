"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { IAPIOffered } from "@/interface/offered.interface"
import { Badge } from "@/components/ui/badge"
import { ChartColumnBig, TableOfContents } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RightSheetModal } from "@/components/right-sheet-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export const AttritionRateCoursestColumns: ColumnDef<IAPIOffered>[] = [
    {
        id: "icon",
        cell: () => {
            return (
                <div className="w-0">
                    <ChartColumnBig color="#000000" size={18} />
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

            const handleViewDetails = () => {
                setIsOpen(true)
            }

            const handleOpenChange = (open: boolean) => {
                setIsOpen(open)
            }
            return (
                <div className="flex justify-end">
                    <Button onClick={handleViewDetails} variant={`outline`} size={`sm`} className="flex items-center gap-4">
                        <TableOfContents color="#000000" size={18} /> View Attrition
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
                                                <CardHeader className="space-y-4">
                                                    <CardTitle className="text-4xl font-bold">GRADLINK</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-8">
                                                    <RadioGroup
                                                        defaultValue="latest"
                                                        // onValueChange={setSemester}
                                                        className="flex flex-wrap gap-4"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="latest" id="latest" />
                                                            <Label htmlFor="latest">Latest Semester</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="past3" id="past3" />
                                                            <Label htmlFor="past3">Past 3 Semesters</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="all" id="all" />
                                                            <Label htmlFor="all">All Semester</Label>
                                                        </div>
                                                    </RadioGroup>

                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                            <div className="font-medium">Total Student Enrolled</div>
                                                            <div className="border rounded-lg p-3 text-right">
                                                                34
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                            <div className="font-medium">Passed</div>
                                                            <div className="border rounded-lg p-3 text-right">
                                                                34
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                            <div className="font-medium">Failed</div>
                                                            <div className="border rounded-lg p-3 text-right">
                                                                4
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                            <div className="font-medium">Dropped/Retake</div>
                                                            <div className="border rounded-lg p-3 text-right">
                                                                7
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                            <div className="font-medium">Dropped/Leave</div>
                                                            <div className="border rounded-lg p-3 text-right">
                                                                10
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-4 border-t">
                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                            <div className="font-medium">Attrition Rate for [Course]</div>
                                                            <div className="border rounded-lg p-3 text-right font-semibold">
                                                                20 %
                                                            </div>
                                                        </div>
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