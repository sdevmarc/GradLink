"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialogConfirmation } from "@/components/alert-dialog";
import { useNavigate } from "react-router-dom";
import { API_PROGRAM_FINDALL } from "@/api/program";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IAPIPrograms } from "@/interface/program.interface";
import { DataTableFacetedFilter } from "@/components/data-table-components/data-table-faceted-filter";
import { CalendarDatePicker } from "@/components/calendar-date-picker";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbarListOfStudent<TData>({
    table
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date()
    });

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
    const [formattedprogram, setFormattedProgram] = useState([])
    const department_options = [
        { value: 'SEAIT', label: 'SEAIT' },
        { value: 'SHANS', label: 'SHANS' },
        { value: 'SAB', label: 'SAB' },
        { value: 'STEH', label: 'STEH' },
        { value: 'CL', label: 'CL' },
    ]

    useEffect(() => {
        // Set initial date filter when component mounts
        if (dateRange.from && dateRange.to) {
            table.getColumn("createdAt")?.setFilterValue([
                dateRange.from,
                dateRange.to
            ]);
        }
    }, []);

    const { data: program, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['programs']
    })

    useEffect(() => {
        if (programFetched) {
            const formatprogram = program.data.map((item: IAPIPrograms) => {
                const { _id, code } = item
                return { value: _id, label: code }
            })

            setFormattedProgram(formatprogram)
        }
    }, [program])

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
                {(table.getColumn("program") && programFetched) && (
                    <DataTableFacetedFilter
                        column={table.getColumn("program")}
                        title="Program"
                        options={formattedprogram}
                    />
                )}
                {table.getColumn("department") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("department")}
                        title="Department"
                        options={department_options}
                    />
                )}
                <CalendarDatePicker
                    date={dateRange}
                    onDateSelect={handleDateSelect}
                    className="w-[200px] h-8"
                    variant={`outline`}
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
            </div>
            <div className="flex gap-2 items-center">
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