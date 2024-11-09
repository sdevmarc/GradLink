"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants"
import { LibraryBig, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { API_PROGRAM_FINDALL } from "@/api/program"
import { useQuery } from "@tanstack/react-query"
import { IAPIPrograms } from "@/interface/program.interface"
import { DataTableFacetedFilter } from "@/components/data-table-components/data-table-faceted-filter"

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
    const isFiltered = table.getState().columnFilters.length > 0
    const navigate = useNavigate()
    const [formattedprogram, setFormattedProgram] = useState<ProgramOption[]>([]);
    const [filteredPrograms, setFilteredPrograms] = useState<ProgramOption[]>([]);

    const department_options = [
        { value: 'SEAIT', label: "Eng'g, Dev't. Arts & Design, Library Science & IT" },
        { value: 'SHANS', label: "Science and Mathematics" },
        { value: 'SAB', label: "Business and Accountancy" },
        { value: 'STEH', label: "Teacher Education and Humanities" }
    ]

    const { data: program, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['programs']
    })

    useEffect(() => {
        if (!programLoading && programFetched) {
            const formatprogram = program.data.map((item: IAPIPrograms) => {
                const { _id, code, department } = item
                return {
                    value: _id, label: code, department: department // Make sure your API returns this
                }
            })

            setFormattedProgram(formatprogram)
            setFilteredPrograms(formatprogram)
        }
    }, [program])

    useEffect(() => {
        const selectedDepartment = table.getColumn("department")?.getFilterValue() as string[];

        if (selectedDepartment && selectedDepartment.length > 0) {
            const filtered = formattedprogram.filter((prog: any) =>
                selectedDepartment.includes(prog.department)
            );
            setFilteredPrograms(filtered);

            // Clear program filter if selected program is not in filtered list
            const currentProgramFilter = table.getColumn("program")?.getFilterValue() as string[];
            if (currentProgramFilter && currentProgramFilter.length > 0) {
                const validPrograms = filtered.map(p => p.value);
                const newProgramFilter = currentProgramFilter.filter(p =>
                    validPrograms.includes(p)
                );
                if (newProgramFilter.length !== currentProgramFilter.length) {
                    table.getColumn("program")?.setFilterValue(newProgramFilter);
                }
            }
        } else {
            setFilteredPrograms(formattedprogram);
        }
    }, [table.getColumn("department")?.getFilterValue()]);

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search course..."
                    value={(table.getColumn("descriptiveTitle")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("descriptiveTitle")?.setFilterValue(event.target.value);
                    }}
                    className="h-8 w-[17rem] lg:w-[20rem]"
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                        size={`sm`}
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
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
            </div>
            <div className="flex gap-2 items-center">
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
                <AlertDialogConfirmation
                    className="flex items-center gap-2"
                    type={`default`}
                    variant={'outline'}
                    btnIcon={<LibraryBig className="text-primary" size={18} />}
                    btnTitle="Previous Courses"
                    title="Are you sure?"
                    description={`You will be redirect to a page viewing the past offered courses.`}
                    btnContinue={() => navigate(ROUTES.ENROLLMENT_ARCHIVED_ACADEMIC_YEAR_OFFERED_COURSES)}
                />
            </div>
        </div>
    )
}