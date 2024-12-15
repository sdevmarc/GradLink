"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants"
import { LibraryBig, Pencil, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { API_PROGRAM_FINDALL } from "@/api/program"
import { useQuery } from "@tanstack/react-query"
import { IAPIPrograms } from "@/interface/program.interface"
import { DataTableFacetedFilter } from "@/components/data-table-components/data-table-faceted-filter"
import { API_USER_GET_USER } from "@/api/user"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

interface ProgramOption {
    value: string;
    label: string;
    department: string;
}

export function DataTableToolbarCoursesOfferedInEnrollment<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter;
    const navigate = useNavigate()
    const [filteredPrograms, setFilteredPrograms] = useState<ProgramOption[]>([]);

    const department_options = [
        { value: 'SEAIT', label: "Eng'g, Dev't. Arts & Design, Library Science & IT" },
        { value: 'SHANS', label: "Science and Mathematics" },
        { value: 'SAB', label: "Business and Accountancy" },
        { value: 'STEH', label: "Teacher Education and Humanities" }
    ]

    const { data: userdata, isFetched: userdataFetched } = useQuery({
        queryFn: () => API_USER_GET_USER(),
        queryKey: ['users']
    })

    const { data: program, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['programs'],
        enabled: userdataFetched
    })

    useEffect(() => {
        if (!programLoading && programFetched) {
            const formatprogram = program.data.map((item: IAPIPrograms) => {
                const { _id, code, department } = item
                return {
                    value: _id, label: code, department: department // Make sure your API returns this
                }
            })

            // setFormattedProgram(formatprogram)
            setFilteredPrograms(formatprogram)
        }
    }, [program])

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search course..."
                    value={(table.getState().globalFilter as string) ?? ""}
                    onChange={(event) => {
                        table.setGlobalFilter(event.target.value);
                    }}
                    className="h-8 w-[20rem] lg:w-[25rem]"
                />
                {table.getColumn("department") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("department")}
                        title="Department"
                        options={department_options}
                    />
                )}
                {(table.getColumn("program") && programFetched) && (
                    <DataTableFacetedFilter
                        column={table.getColumn("program")}
                        title="Program"
                        options={filteredPrograms}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            table.resetColumnFilters()
                            table.setGlobalFilter('')
                        }}
                        className="h-8 px-2 lg:px-3"
                        size={`sm`}
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            {
                userdataFetched &&
                <div className="flex gap-2 items-center">
                    {
                        (userdata?.data?.role === 'root' || userdata?.data?.role === 'admin') &&
                        <AlertDialogConfirmation
                            className="flex items-center gap-2"
                            type={`default`}
                            variant={'outline'}
                            btnIcon={<Plus className="text-primary" size={18} />}
                            btnTitle="New Offered Courses"
                            title="Are you sure?"
                            description={`You will be redirect to a page for creating new offered courses.`}
                            btnContinue={() => navigate(ROUTES.CREATE_COURSE_OFFERED)}
                        />
                    }
                    <AlertDialogConfirmation
                        className="flex items-center gap-2"
                        type={`default`}
                        variant={'outline'}
                        btnIcon={<LibraryBig className="text-primary" size={18} />}
                        btnTitle="Previous Courses"
                        title="Are you sure?"
                        description={`You will be redirect to a page for viewing the past offered courses.`}
                        btnContinue={() => navigate(ROUTES.ENROLLMENT_ARCHIVED_ACADEMIC_YEAR_OFFERED_COURSES)}
                    />
                    {
                        (userdata?.data?.role === 'root' || userdata?.data?.role === 'admin') &&
                        <AlertDialogConfirmation
                            className="flex items-center gap-2"
                            type={`default`}
                            variant={'outline'}
                            btnIcon={<Pencil className="text-primary" size={18} />}
                            // btnTitle=""
                            title="Are you sure?"
                            description={`You will be redirect to a page for updating offered courses.`}
                            btnContinue={() => navigate(ROUTES.UPDATE_COURSE_OFFERED)}
                        />
                    }
                </div>
            }
        </div>
    )
}