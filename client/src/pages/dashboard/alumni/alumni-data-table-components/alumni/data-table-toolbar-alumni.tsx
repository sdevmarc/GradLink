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
import { LoaderCircle } from "lucide-react"

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
    const isFiltered = table.getState().columnFilters.length > 0
    const [formattedprogram, setFormattedProgram] = useState<ProgramOption[]>([]);
    const [filteredPrograms, setFilteredPrograms] = useState<ProgramOption[]>([]);
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
                                options={filteredPrograms}
                            />
                        )}
                        {table.getColumn("academicYear") && (
                            <DataTableFacetedFilter
                                column={table.getColumn("academicYear")}
                                title="Year Graduated"
                                options={filteredYearsGraduated}
                            />
                        )}

                    </div>
                </div>

                {
                    isSync &&
                    <div className="flex items-center gap-2">

                        <LoaderCircle className={`text-muted-foreground animate-spin`} size={18} />
                        <h1 className="text-muted-foreground text-sm">
                            Syncing
                        </h1>
                    </div>
                }

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
            </div>
        </div>
    )
}