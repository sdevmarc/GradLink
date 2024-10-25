"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants"
import { DataTableFacetedFilter } from "@/components/data-table-components/data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbarAvailablePrograms<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const navigate = useNavigate()
    const options = [
        { label: "1 Year", value: 1 },
        { label: "2 Years", value: 2 },
        { label: "3 Years", value: 3 },
        { label: "4 Years", value: 4 },
        { label: "5 Years", value: 5 },
    ]

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search program code..."
                    value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("code")?.setFilterValue(event.target.value);
                    }}
                    className="h-8 w-[20rem] lg:w-[25rem]"
                />
                 {table.getColumn("residency") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("residency")}
                        title="Residency"
                        options={options}
                    />
                )}
               {/* {table.getColumn("type") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("type")}
                        title="Type"
                        options={incomeType}
                    />
                )} */}
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
                    type={`default`}
                    variant={'outline'}
                    btnTitle="New Program"
                    title="Are you sure?"
                    description={`This will add a new program to the current curriculum.`}
                    btnContinue={() => navigate(ROUTES.CREATE_PROGRAM)}
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
    )
}