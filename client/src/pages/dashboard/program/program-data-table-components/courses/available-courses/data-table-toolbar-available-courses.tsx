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

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbarAvailableCourses<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const navigate = useNavigate()
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
                    placeholder="Search course number..."
                    value={(table.getColumn("courseno")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("courseno")?.setFilterValue(event.target.value)
                    }}
                    className="h-8 w-[20rem] lg:w-[25rem]"
                />
                {table.getColumn("units") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("units")}
                        title="Units"
                        options={options}
                    />
                )}
                {/*  {table.getColumn("type") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("courseno")}
                        title="Type"
                        options={[]}
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
                    className="flex items-center gap-2"
                    type={`default`}
                    variant={'outline'}
                    btnIcon={<Plus color="#000000" size={18} />}
                    btnTitle="New Course"
                    title="Are you sure?"
                    description={`You will be redirect to a page for creating a course.`}
                    btnContinue={() => navigate(ROUTES.CREATE_COURSE)}
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