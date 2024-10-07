"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { IAPIStudents } from "@/interface/student.interface"
import { DataTableRowActionsListOfStudent } from "./data-table-row-actions-list-of-students"

export const StudentListOfStudentsColumns: ColumnDef<IAPIStudents>[] = [
    {
        accessorKey: "idNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-[100px] capitalize">{row.getValue("idNumber")}</div>
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Full Name" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize font-medium">
                        {row.getValue("name")}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[100px] truncate capitalize font-medium">
                        {row.getValue("email")}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "progress",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Progress" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="capitalize"> {row.getValue("progress")}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActionsListOfStudent row={row} />
    }
]