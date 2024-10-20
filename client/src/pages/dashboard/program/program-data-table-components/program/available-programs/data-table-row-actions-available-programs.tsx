"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { RightSheetModal } from "@/components/right-sheet-modal"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { API_PROGRAM_FINDONE } from "@/api/program"

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function DataTableRowActionsAvailablePrograms<TData>({ row }: DataTableRowActionsProps<TData>) {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleViewDetails = () => {
        setIsOpen(true)
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={handleViewDetails}>View details</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <RightSheetModal
                className="w-[60%]"
                isOpen={isOpen}
                onOpenChange={handleOpenChange}
                title="Program Details"
                description="View details of the selected program."
                content={<ViewProgramDetails row={row} />}
            />
        </>
    )
}

function ViewProgramDetails<TData>({ row }: DataTableRowActionsProps<TData>) {
    const id = (row.original as any)._id

    const { data: program, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDONE({ _id: id ?? '' }),
        queryKey: ['findone_program'],
        enabled: !!id
    })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <main className="flex justify-center items-center py-4">
                        <div className="min-h-screen w-full max-w-[70rem]">
                            {
                                programFetched &&
                                <Card className="w-full mx-auto">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="capitalize text-3xl font-bold">
                                                    {program.data.descriptiveTitle}
                                                </CardTitle>
                                                <CardDescription className="mt-2">
                                                    <Badge variant="default" className="mr-2">
                                                        {program.data.code || ''}
                                                    </Badge>
                                                    <span className="text-muted-foreground">
                                                        {program.data.curriculum}
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
                                                    <span>Residency: {program.data.residency || ''} years</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                                                    <span>Credits: {program.data.totalUnits}</span>
                                                </div>
                                            </div>
                                        </section>

                                        <section className="space-y-4">
                                            <div>
                                                <h3 className="font-semibold text-lg">Courses</h3>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                                    {
                                                        program.data.courses.map((item: { _id: string, descriptiveTitle: string }) => (
                                                            <li key={item._id} className="flex items-center">
                                                                <GraduationCap className="h-5 w-5 mr-2 text-muted-foreground" />
                                                                {item.descriptiveTitle}
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        </section>
                                    </CardContent>
                                </Card>
                            }
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}