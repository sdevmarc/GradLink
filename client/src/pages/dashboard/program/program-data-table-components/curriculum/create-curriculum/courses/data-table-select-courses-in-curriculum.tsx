"use client"

import { Button } from '@/components/ui/button'

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    FilterFn,
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
import { DataTableToolbarSelectCoursesInCurriculum } from './data-table-toolbar-select-courses-in-curriculum'
import { IAPICourse } from '@/interface/course.interface'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    fetchAddedCourses: (e: IAPICourse[]) => void
    resetSelection: boolean
    onResetComplete: () => void
}

const globalFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
    // Split the input into keywords
    const keywords = filterValue.toLowerCase().split(' ').filter(Boolean);

    // Collect the values from the columns you want to search
    const rowValues = [
        row.getValue('descriptiveTitle')?.toString().toLowerCase(),
        row.getValue('units')?.toString().toLowerCase(),
        row.getValue('code')?.toString().toLowerCase(),
        row.getValue('courseno')?.toString().toLowerCase(), // Example of an additional column
        // Add other columns as needed
    ];

    // Check if every keyword is present in any of the row values
    return keywords.every((keyword: string) =>
        rowValues.some(value => value?.includes(keyword))
    );
};

export function DataTableSelectCoursesInCurriculum<TData, TValue>({
    columns,
    data,
    fetchAddedCourses,
    resetSelection,
    onResetComplete
}: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = React.useState('')
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
            globalFilter,
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        onGlobalFilterChange: setGlobalFilter, // Add this line
        globalFilterFn,
    })

    React.useEffect(() => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        const courses = selectedRows.map(row => {
            const original = row.original as IAPICourse
            const { _id, code, courseno, descriptiveTitle, units } = original
            return { _id, code, courseno, descriptiveTitle, units }
        })

        fetchAddedCourses(courses)

    }, [rowSelection, table])

    React.useEffect(() => {
        if (resetSelection) {
            table.resetRowSelection()
            onResetComplete()
        }
    }, [resetSelection, table, onResetComplete])
    return (
        <div className="w-full flex flex-col gap-2">
            <DataTableToolbarSelectCoursesInCurriculum table={table} />
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