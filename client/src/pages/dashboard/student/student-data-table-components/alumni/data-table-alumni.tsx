"use client"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import { DataTableViewOptions } from '@/components/data-table-components/data-table-view-options'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTableStudentAlumni<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const isFiltered = table.getState().columnFilters.length > 0;
    // const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    //     from: new Date(new Date().getFullYear(), 0, 1),
    //     to: new Date()
    // });

    // const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    //     setDateRange({ from, to });
    //     // Filter table data based on selected date range
    //     table.getColumn("date")?.setFilterValue([from, to]);
    // };
    const navigate = useNavigate()

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    <Input
                        placeholder="Filter labels..."
                        value={(table.getColumn("idNumber")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => {
                            table.getColumn("idNumber")?.setFilterValue(event.target.value);
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
                    <Button onClick={() => navigate(ROUTES.CREATE_STUDENT)} variant={`outline`} size={`sm`}>
                        Enroll a student
                    </Button>
                    <AlertDialogConfirmation
                        btnTitle="Export"
                        title="Are you sure?"
                        description={`This will export the current data you are viewing.`}
                        btnContinue={() => navigate('/program')}
                    />
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}