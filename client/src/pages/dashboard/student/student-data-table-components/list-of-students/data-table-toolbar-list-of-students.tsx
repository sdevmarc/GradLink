"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialogConfirmation } from "@/components/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { ROUTES } from "@/constants";
import { DataTableFacetedFilter } from "@/components/data-table-components/data-table-faceted-filter";
import { Plus } from "lucide-react";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

// interface ProgramOption {
//     value: string;
//     label: string;
//     department: string;
// }

export function DataTableToolbarListOfStudent<TData>({
    table
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
    // const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    //     from: new Date(new Date().getFullYear(), 0, 1),
    //     to: new Date()
    // });

    const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
        setDateRange({ from, to });
        // Filter table data based on selected date range
        if (from && to) {
            table.getColumn("createdAt")?.setFilterValue([
                new Date(from),
                new Date(to)
            ]);
        } else {
            table.getColumn("createdAt")?.setFilterValue(undefined);
        }
    }
    const navigate = useNavigate()
    // const [formattedprogram, setFormattedProgram] = useState<ProgramOption[]>([]);
    // const [filteredPrograms, setFilteredPrograms] = useState<ProgramOption[]>([]);
    // const department_options = [
    //     { value: 'SEAIT', label: 'SEAIT' },
    //     { value: 'SHANS', label: 'SHANS' },
    //     { value: 'SAB', label: 'SAB' },
    //     { value: 'STEH', label: 'STEH' },
    //     { value: 'CL', label: 'CL' },
    // ]

    // const { data: program, isLoading: programLoading, isFetched: programFetched } = useQuery({
    //     queryFn: () => API_PROGRAM_FINDALL(),
    //     queryKey: ['programs']
    // })

    // useEffect(() => {
    //     if (!programLoading && programFetched) {
    //         const formatprogram = program.data.map((item: IAPIPrograms) => {
    //             const { _id, code, department } = item
    //             return {
    //                 value: _id, label: code, department: department // Make sure your API returns this
    //             }
    //         })

    //         setFormattedProgram(formatprogram)
    //         setFilteredPrograms(formatprogram)
    //     }
    // }, [program])

    // useEffect(() => {
    //     const selectedDepartment = table.getColumn("department")?.getFilterValue() as string[];

    //     if (selectedDepartment && selectedDepartment.length > 0) {
    //         const filtered = formattedprogram.filter((prog: any) =>
    //             selectedDepartment.includes(prog.department)
    //         );
    //         setFilteredPrograms(filtered);

    //         // Clear program filter if selected program is not in filtered list
    //         const currentProgramFilter = table.getColumn("program")?.getFilterValue() as string[];
    //         if (currentProgramFilter && currentProgramFilter.length > 0) {
    //             const validPrograms = filtered.map(p => p.value);
    //             const newProgramFilter = currentProgramFilter.filter(p =>
    //                 validPrograms.includes(p)
    //             );
    //             if (newProgramFilter.length !== currentProgramFilter.length) {
    //                 table.getColumn("program")?.setFilterValue(newProgramFilter);
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
                    placeholder="Search ID Number..."
                    value={(table.getColumn("idNumber")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("idNumber")?.setFilterValue(event.target.value);
                    }}
                    className="h-8 w-[250px] lg:w-[300px]"
                />
                <DataTableFacetedFilter
                    column={table.getColumn("department")}
                    title="Department"
                    options={[]}
                />
                <DataTableFacetedFilter
                    column={table.getColumn("department")}
                    title="Program"
                    options={[]}
                />
                {/* {table.getColumn("department") && (
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
                )} */}
                {/* <CalendarDatePicker
                    date={dateRange || {
                        from: new Date(new Date().getFullYear(), 0, 1),
                        to: new Date()
                    }}
                    onDateSelect={handleDateSelect}
                    className="w-[200px] h-8"
                    variant={`outline`}
                /> */}
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
            <div className="flex gap-2 items-center">
                <AlertDialogConfirmation
                    className="flex items-center gap-2"
                    type={`default`}
                    variant={'outline'}
                    btnIcon={<Plus color="#000000" size={18} />}
                    btnTitle="New Student"
                    title="Are you sure?"
                    description={`You will be redirect to page for creating new student.`}
                    btnContinue={() => navigate(ROUTES.NEW_STUDENT)}
                />

                <AlertDialogConfirmation
                    type={`default`}
                    variant={'outline'}
                    btnTitle="Export"
                    title="Are you sure?"
                    description={`This will export the current data you are viewing.`}
                    btnContinue={() => navigate('/program')}
                />
            </div>
        </div>
    );
}