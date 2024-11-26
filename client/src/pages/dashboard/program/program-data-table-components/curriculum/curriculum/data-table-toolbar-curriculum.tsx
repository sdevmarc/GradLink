"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants"
import { DataTableFacetedFilter } from "@/components/data-table-components/data-table-faceted-filter"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { API_PROGRAM_FINDALL } from "@/api/program"
import { useQuery } from "@tanstack/react-query"
import { IAPIPrograms } from "@/interface/program.interface"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

interface ProgramOption {
    value: string;
    label: string;
    department: string;
}

export function DataTableToolbarCurriculum<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const navigate = useNavigate()
    const [formattedprogram, setFormattedProgram] = useState<ProgramOption[]>([]);
    // const [filteredPrograms, setFilteredPrograms] = useState<ProgramOption[]>([]);

    const options = [
        { label: "Active", value: true },
        { label: "Legacy", value: false }
    ]

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
            // setFilteredPrograms(formatprogram)
        }
    }, [program])

    // useEffect(() => {
    //     const selectedDepartment = table.getColumn("department")?.getFilterValue() as string[];

    //     if (selectedDepartment && selectedDepartment.length > 0) {
    //         const filtered = formattedprogram.filter((prog: any) =>
    //             selectedDepartment.includes(prog.department)
    //         );
    //         setFilteredPrograms(filtered);

    //         // Clear program filter if selected program is not in filtered list
    //         const currentProgramFilter = table.getColumn("programid")?.getFilterValue() as string[];
    //         if (currentProgramFilter && currentProgramFilter.length > 0) {
    //             const validPrograms = filtered.map(p => p.value);
    //             const newProgramFilter = currentProgramFilter.filter(p =>
    //                 validPrograms.includes(p)
    //             );
    //             if (newProgramFilter.length !== currentProgramFilter.length) {
    //                 table.getColumn("programid")?.setFilterValue(newProgramFilter);
    //             }
    //         }
    //     } else {
    //         setFilteredPrograms(formattedprogram);
    //     }
    // }, [table.getColumn("department")?.getFilterValue()]);
    
    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("name")?.setFilterValue(event.target.value);
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
                {table.getColumn("programid") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("programid")}
                        title="Program"
                        options={formattedprogram}
                    />
                )}
                {table.getColumn("isActive") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("isActive")}
                        title="Status"
                        options={options}
                    />
                )}

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
                {/* <CalendarDatePicker
                    date={dateRange}
                    onDateSelect={handleDateSelect}
                    className="w-[250px] h-8"
                    variant="outline"
                /> */}
            </div>
            <div className="flex gap-2 items-center">
                <AlertDialogConfirmation
                    className="flex items-center gap-2"
                    type={`default`}
                    variant={'outline'}
                    btnIcon={<Plus className="text-primary" size={18} />}
                    btnTitle="New Curriculum"
                    title="Are you sure?"
                    description={`You will be redirect to a page for creating a curriculum.`}
                    btnContinue={() => navigate(ROUTES.CREATE_CURRICULUM)}
                />
                {/* <AlertDialogConfirmation
                    type={`default`}
                    variant={'outline'}
                    btnTitle="Export"
                    title="Are you sure?"
                    description={`This will export the current data you are viewing.`}
                    btnContinue={() => navigate('/program')}
                /> */}
            </div>
        </div>
    )
}