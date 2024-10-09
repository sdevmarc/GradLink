"use client"

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
import { IAPICourse } from '@/interface/course.interface'
import { DataTableToolbarEnrollStudent } from './data-table-toolbar-enroll-student'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    onSubmit: (e: IAPICourse[]) => void
    resetSelection: boolean
    onResetComplete: () => void
    selectedPrograms?: string[]
    isAdditional: (e: boolean) => void
}

export function DataTableEnrollStudent<TData, TValue>({
    columns,
    data,
    onSubmit,
    resetSelection,
    onResetComplete,
    selectedPrograms = [],
    isAdditional
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

    React.useEffect(() => {
        if (selectedPrograms.length > 0) {
            const newSelection: Record<string, boolean> = {}
            table.getFilteredRowModel().rows.forEach((row) => {
                const course = row.original as IAPICourse
                const shouldSelectRow = course.degree?.some(degree =>
                    selectedPrograms.includes(degree.code)
                )

                // Set the selection state based on the check
                if (shouldSelectRow) {
                    newSelection[row.id] = true
                }
            })
            setRowSelection(newSelection)
        } else {
            setRowSelection({})
        }
    }, [selectedPrograms, table])

    React.useEffect(() => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        const courses = selectedRows.map(row => {
            const original = row.original as IAPICourse
            const { courseno, descriptiveTitle, units } = original

            return { courseno, descriptiveTitle, units }
        })
        onSubmit(courses)
    }, [rowSelection, table])

    React.useEffect(() => {
        if (resetSelection) {
            table.resetRowSelection()
            onResetComplete()
        }
    }, [resetSelection, table, onResetComplete])

    return (
        <div className="w-full">
            <DataTableToolbarEnrollStudent table={table} isAdditional={(e) => isAdditional(e)} />
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
                        Previousss
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