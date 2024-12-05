"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { API_PROGRAM_FINDALL } from "@/api/program"
import { API_STUDENT_YEARS_GRADUATED } from "@/api/student"
import { DataTableFacetedFilter } from "@/components/data-table-components/data-table-faceted-filter"
import { IAPIPrograms } from "@/interface/program.interface"
import { LoaderCircle, Trash2 } from "lucide-react"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    isSync: boolean
}

interface ProgramOption {
    value: string;
    label: string;
    department: string;
}

export function DataTableToolbarAlumni<TData>({
    table,
    isSync
}: DataTableToolbarProps<TData>) {
    const navigate = useNavigate()
    const isFiltered = table.getState().columnFilters.length > 0
    const [formattedprogram, setFormattedProgram] = useState<ProgramOption[]>([]);
    const [filteredYearsGraduated, setFilteredYearsGraduated] = useState<{ label: string, value: string }[]>([])

    const { data: yearsGraduations, isFetched: yearsgraduatedFetched } = useQuery({
        queryFn: () => API_STUDENT_YEARS_GRADUATED(),
        queryKey: ['years']
    })

    const { data: program, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['programs']
    })

    useEffect(() => {
        if (!programLoading && programFetched) {
            const formatprogram = program.data.map((item: IAPIPrograms) => {
                const { _id, code, department } = item
                return { value: _id, label: code, department: department }
            })

            setFormattedProgram(formatprogram)
        }
    }, [program])

    useEffect(() => {
        if (yearsgraduatedFetched) {
            const filteredYears: { label: string, value: string }[] = yearsGraduations?.data?.map((item: { academicYear: string }) => {
                const { academicYear } = item
                return { label: academicYear, value: academicYear }
            }) || []

            setFilteredYearsGraduated(filteredYears)
        }
    }, [yearsGraduations])

    const department_options = [
        { value: 'SEAIT', label: "Eng'g, Dev't. Arts & Design, Library Science & IT" },
        { value: 'SHANS', label: "Science and Mathematics" },
        { value: 'SAB', label: "Business and Accountancy" },
        { value: 'STEH', label: "Teacher Education and Humanities" }
    ]

    const job_options = [
        { value: 'Self-employed', label: "Self-employed" },
        { value: 'Managerial or Executive', label: "Managerial or Executive" },
        { value: 'Professional, Technical or Supervisory', label: "Professional, Technical or Supervisory" },
        { value: 'Rank or Clerical', label: "Rank or Clerical" }
    ]

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search ID Number"
                        value={(table.getColumn("idNumber")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => {
                            table.getColumn("idNumber")?.setFilterValue(event.target.value)
                        }}
                        className="h-8 w-[17rem] lg:w-[20rem]"
                    />

                    <div className="flex items-center gap-2">
                        {table.getColumn("department") && (
                            <DataTableFacetedFilter
                                column={table.getColumn("department")}
                                title="Department"
                                options={department_options}
                            />
                        )}
                        {table.getColumn("program") && (
                            <DataTableFacetedFilter
                                column={table.getColumn("program")}
                                title="Program"
                                options={formattedprogram}
                            />
                        )}
                        {table.getColumn("academicYear") && (
                            <DataTableFacetedFilter
                                column={table.getColumn("academicYear")}
                                title="Year Graduated"
                                options={filteredYearsGraduated}
                            />
                        )}
                        {table.getColumn("currentJobLevel") && (
                            <DataTableFacetedFilter
                                column={table.getColumn("currentJobLevel")}
                                title="Current Job Level"
                                options={job_options}
                            />
                        )}
                    </div>
                </div>

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

                <div className="flex items-center justify-end gap-2">
                    {
                        isSync &&
                        <div className="flex items-center gap-2">
                            <LoaderCircle className={`text-muted-foreground animate-spin`} size={18} />
                            <h1 className="text-muted-foreground text-sm">
                                Syncing
                            </h1>
                        </div>
                    }
                    <AlertDialogConfirmation
                        className="flex items-center gap-2"
                        type={`default`}
                        variant={'outline'}
                        btnIcon={<Trash2 className="text-primary" size={18} />}
                        btnTitle="Trash"
                        title="Are you sure?"
                        description={`This action will redirect you to a page for trashed alumni information.`}
                        btnContinue={() => navigate(ROUTES.ALUMNI_TRASH)}
                    />
                </div>
            </div>
        </div>
    )
}