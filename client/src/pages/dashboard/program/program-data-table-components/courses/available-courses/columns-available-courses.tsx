"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { IAPICourse } from '@/interface/course.interface'
import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { DataTableRowActionsAvailableCourses } from "./data-table-row-actions-available-courses"

export const AvailableCoursesColumns: ColumnDef<IAPICourse>[] = [
    {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Code" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-[100px] capitalize">{row.getValue("code")}</div>
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "courseno",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Course No." className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-[100px] capitalize">{row.getValue("courseno")}</div>
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "descriptiveTitle",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Descriptive Title" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[200px] truncate capitalize font-medium">
                        {row.getValue("descriptiveTitle")}
                    </span>
                </div>
            );
        }
    },
    {
        accessorKey: "units",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Units" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[60px] items-center">
                    <span className="capitalize"> {row.getValue("units")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActionsAvailableCourses row={row} />
    }
]