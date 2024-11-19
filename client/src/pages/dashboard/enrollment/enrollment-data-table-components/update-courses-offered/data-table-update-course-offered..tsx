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
import { DataTableToolbarUpdateCourseOffered } from './data-table-toolbar-update-course-offered.'
import { API_FINDALL_COURSES_OFFERED } from '@/api/offered'
import { useQuery } from '@tanstack/react-query'
import { IAPIOffered } from '@/interface/offered.interface'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    fetchCourses: (e: IAPICourse[]) => void
}

export function DataTableUpdateCourseOffered<TData, TValue>({
    columns,
    data,
    fetchCourses,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        department: false,
        program: false
    })
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

    const { data: courses, isLoading: coursesLoading, isFetched: coursesFetched } = useQuery({
        queryFn: () => API_FINDALL_COURSES_OFFERED(),
        queryKey: ['courses-offered']
    })

    React.useEffect(() => {
        if (coursesFetched && courses?.data) {
            const filteredCourseIds = new Set(
                courses.data.map((item: IAPIOffered) => item._id)
            )

            // Create new rowSelection object
            const newRowSelection: Record<number, boolean> = {}
            table.getRowModel().rows.forEach((row, index) => {
                const courseData = row.original as IAPICourse
                if (filteredCourseIds.has(courseData._id)) {
                    newRowSelection[index] = true
                }
            })

            // Update row selection state
            setRowSelection(newRowSelection)
        }
    }, [courses, coursesFetched, data])

    React.useEffect(() => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        const course_checks = selectedRows.map(row => {
            const original = row.original as IAPICourse
            const { _id, code, courseno, descriptiveTitle, units } = original
            return { _id, code, courseno, descriptiveTitle, units }
        })

        fetchCourses(course_checks)

    }, [rowSelection, table])

    return (
        <div className="w-full flex flex-col gap-4">
            <DataTableToolbarUpdateCourseOffered table={table} />
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