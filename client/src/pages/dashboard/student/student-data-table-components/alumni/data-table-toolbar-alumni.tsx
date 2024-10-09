"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-components/data-table-view-options"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { useNavigate } from "react-router-dom"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbarAlumni<TData>({
    table
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    // const [dateRange, setDateRange] = useState<{ from: Date to: Date }>({
    //     from: new Date(new Date().getFullYear(), 0, 1),
    //     to: new Date()
    // })

    // const handleDateSelect = ({ from, to }: { from: Date to: Date }) => {
    //     setDateRange({ from, to })
    //     // Filter table data based on selected date range
    //     table.getColumn("date")?.setFilterValue([from, to])
    // }
    const navigate = useNavigate()

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Filter labels..."
                    value={(table.getColumn("idNumber")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("idNumber")?.setFilterValue(event.target.value)
                    }}
                    className="h-8 w-[20rem] lg:w-[25rem] placeholder:text-muted"
                />

                {/* {table.getColumn("category") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("category")}
                        title="Category"
                        options={categories}
                    />
                )}
                {table.getColumn("type") && (
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
                        size={`sm`}
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
                    btnTitle="Export"
                    title="Are you sure?"
                    description={`This will export the current data you are viewing.`}
                    btnContinue={() => navigate('/program')}
                />
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}