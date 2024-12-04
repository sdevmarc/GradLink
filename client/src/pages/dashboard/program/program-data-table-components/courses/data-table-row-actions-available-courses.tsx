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
import {  SheetModal } from "@/components/sheet-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, GraduationCap } from "lucide-react"
import { useState } from "react"

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function DataTableRowActionsAvailableCourses<TData>({ row }: DataTableRowActionsProps<TData>) {
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
                    <DropdownMenuItem onClick={handleViewDetails}>View Details</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SheetModal
                className="w-[60%]"
                isOpen={isOpen}
                onOpenChange={handleOpenChange}
                title="Course Details"
                description="View details of the selected course."
                content={<ViewCourseDetails row={row} />}
            />
        </>

    )
}

function ViewCourseDetails<TData>({ row }: DataTableRowActionsProps<TData>) {
    // const id = (row.original as any)._id 
    // const id = '6715200af3d017760db94d00'

    // const { data: program, isLoading: programLoading, isFetched: programFetched } = useQuery({
    //     queryFn: () => API_PROGRAM_FINDONE({ _id: id ?? '' }),
    //     queryKey: ['findone_program'],
    //     enabled: !!id
    // })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <main className="flex justify-center items-center py-4">
                        <div className="min-h-screen w-full max-w-[70rem]">

                            <Card className="w-full mx-auto">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="capitalize text-3xl font-bold">
                                                Master in Information Technology
                                            </CardTitle>
                                            <CardDescription className="mt-2">
                                                <Badge variant="default" className="mr-2">
                                                    MIT 200
                                                </Badge>
                                                <span className="text-muted-foreground">
                                                    Curriculum 2024
                                                </span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <section className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                                                <span>Residency: 4 years</span>
                                            </div>
                                            <div className="flex items-center">
                                                <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                                                <span>Units: 20</span>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-lg">Courses</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                                <li className="flex items-center">
                                                    <GraduationCap className="h-5 w-5 mr-2 text-muted-foreground" />
                                                    Descriptive Title
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
        </>
    )
}