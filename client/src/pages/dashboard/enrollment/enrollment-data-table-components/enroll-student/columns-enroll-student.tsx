"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { IAPICourse } from '@/interface/course.interface'
import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"

export const EnrollStudentColumns: ColumnDef<IAPICourse>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
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
        accessorKey: "lastname",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Name" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate normal-case">
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
                    <span className="max-w-[500px] truncate normal-case">
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
                    <span className="max-w-[500px] truncate normal-case">
                        {row.getValue("middlename")}
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
]