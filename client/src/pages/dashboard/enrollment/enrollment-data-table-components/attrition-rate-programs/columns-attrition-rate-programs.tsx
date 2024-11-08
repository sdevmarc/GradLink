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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export const AttritionRateProgramsColumns: ColumnDef<IAPIOffered>[] = [
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
            const { code, descriptiveTitle, curriculum } = row.original || {}
            const { name } = curriculum || {}

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
                    <SheetModal
                        className="w-[60%]"
                        isOpen={isOpen}
                        onOpenChange={handleOpenChange}
                        title="Program Details"
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
                                                            {name || 'Invalid Curriculum Name'}
                                                        </span>
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-8">
                                                    <RadioGroup
                                                        defaultValue="latest"
                                                        // onValueChange={setSemester}
                                                        className="flex flex-wrap gap-4"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="latest" id="latest" />
                                                            <Label htmlFor="latest">Past 3 Years</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="past3" id="past3" />
                                                            <Label htmlFor="past3">Yearly</Label>
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