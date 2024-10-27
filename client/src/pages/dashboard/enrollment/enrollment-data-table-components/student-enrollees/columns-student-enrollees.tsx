"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { IAPIStudents } from "@/interface/student.interface"

export const StudentEnrolleesColumns: ColumnDef<IAPIStudents>[] = [
    {
        accessorKey: "idNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-[100px] capitalize">{row.getValue("idNumber")}</div>
        ),
    },
    {
        accessorKey: "lastname",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Name" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize">
                        {row.getValue("lastname")}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "firstname",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="First Name" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize">
                        {row.getValue("firstname")}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "middlename",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Middle Name" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize">
                        {
                            row.getValue("middlename") ? row.getValue("middlename") : '[No Middlename]'
                        }
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
                    <span className="max-w-[100px] truncate lowercase">
                        {row.getValue("email")}
                    </span>
                </div>
            )
        }
    },
    // {
    //     id: "actions",
    //     cell: ({ row }) => <DataTableRowActionsStudentEnrollees row={row} />
    // }
]