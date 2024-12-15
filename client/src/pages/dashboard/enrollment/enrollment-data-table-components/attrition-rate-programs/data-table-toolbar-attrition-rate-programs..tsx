"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/data-table-components/data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbarAttritionRatePrograms<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter;

    const department_options = [
        { value: 'SEAIT', label: "Eng'g, Dev't. Arts & Design, Library Science & IT" },
        { value: 'SHANS', label: "Science and Mathematics" },
        { value: 'SAB', label: "Business and Accountancy" },
        { value: 'STEH', label: "Teacher Education and Humanities" }
    ]

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Search program..."
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
        </div>
    )
}