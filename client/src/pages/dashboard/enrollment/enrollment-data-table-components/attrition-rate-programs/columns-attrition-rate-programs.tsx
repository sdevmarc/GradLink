"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { ChartColumnBig, Clock, TableOfContents } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SheetModal } from "@/components/sheet-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { API_PROGRAM_ATTRITION } from "@/api/program"
import { IAPIPrograms } from "@/interface/program.interface"

export const AttritionRateProgramsColumns: ColumnDef<IAPIPrograms>[] = [
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
            // const [attritonRateProgram, setAttritionProgram] = useState({

            // })
            const [isOpen, setIsOpen] = useState<boolean>(false)
            const { _id: id, code, descriptiveTitle, residency } = row.original || {}

            const handleViewDetails = () => {
                setIsOpen(true)
            }

            const handleOpenChange = (open: boolean) => {
                setIsOpen(open)
            }

            const { data: programs, isLoading: programsLoading, isFetched: programsFetched } = useQuery({
                queryFn: () => API_PROGRAM_ATTRITION({ id: id ?? '' }),
                queryKey: ['students', id],
                enabled: !!id
            })

            return (
                <div className="flex justify-end">
                    <Button onClick={handleViewDetails} variant={`outline`} size={`sm`} className="flex items-center gap-4">
                        <TableOfContents className="text-primary" size={18} /> View Attrition
                    </Button>
                    <SheetModal
                        className="w-[45%]"
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
                                                    <CardDescription className="mt-2 flex items-center gap-2">
                                                        <Badge variant="default" className="mr-2">
                                                            {code || 'Inavlid Code'}
                                                        </Badge>
                                                        <div className="flex items-center">
                                                            <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                                                            <span>Residency: {residency} years</span>
                                                        </div>
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-8">
                                                    <Tabs defaultValue="past3" className="w-full">
                                                        <TabsList className="bg-background">
                                                            <TabsTrigger value="past3">Past 3 Years</TabsTrigger>
                                                            <TabsTrigger value="yearly">Yearly</TabsTrigger>
                                                        </TabsList>
                                                        {
                                                            !programsLoading && programsFetched &&
                                                            <>
                                                                <TabsContent value="past3">
                                                                    <div className="space-y-4">
                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="text-md font-medium">
                                                                                Total Student Enrolled
                                                                            </div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {programs?.data?.past3years?.totalEnrolled}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="text-md font-medium">
                                                                                Total Discontinued
                                                                            </div>
                                                                            <div className="border rounded-lg p-3 text-right">
                                                                                {programs?.data?.past3years?.totalDiscontinued}
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div className="pt-4">
                                                                        <div className="grid grid-cols-2 items-center gap-4 text-lg">
                                                                            <div className="text-md font-medium flex flex-col gap-2 capitalize">
                                                                                Attrition Rate for:
                                                                                <span className=" text-mdfont-semibold underline">
                                                                                    {descriptiveTitle}
                                                                                </span>
                                                                            </div>
                                                                            <div className="border rounded-lg p-3 text-right font-semibold">
                                                                                {programs?.data?.past3years?.attritionRate}%
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TabsContent>
                                                                <TabsContent value="yearly">
                                                                    {
                                                                        programs?.data?.yearly?.map((item: { academicYear: string; attritionRate: number }, i: number) => (
                                                                            <div key={i} className="flex items-center justify-between p-4 rounded-md border">
                                                                                <h1 className="font-semibold text-primary">
                                                                                    {item.academicYear}
                                                                                </h1>
                                                                                <h1 className="font-semibold text-primary">
                                                                                    {item.attritionRate}%
                                                                                </h1>
                                                                            </div>
                                                                        ))
                                                                    }
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