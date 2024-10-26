"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/data-table-components/data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbarEnrollStudent<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const options = [
        { label: "1 Unit", value: 1 },
        { label: "2 Units", value: 2 },
        { label: "3 Units", value: 3 },
        { label: "4 Units", value: 4 },
        { label: "5 Units", value: 5 },
    ]

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search ID Number..."
                    value={(table.getColumn("idNumber")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("idNumber")?.setFilterValue(event.target.value);
                    }}
                    className="h-8 w-[20rem] lg:w-[25rem]"
                />
                {/* {table.getColumn("units") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("units")}
                        title="Units"
                        options={options}
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
            </div>
        </div>
    )
}