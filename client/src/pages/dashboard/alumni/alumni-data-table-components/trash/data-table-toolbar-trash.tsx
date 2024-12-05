"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    isSync: boolean
}

export function DataTableToolbarAlumniTrash<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search tracer"
                        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => {
                            table.getColumn("email")?.setFilterValue(event.target.value)
                        }}
                        className="h-8 w-[17rem] lg:w-[20rem]"
                    />


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
            </div>
        </div>
    )
}