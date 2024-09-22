"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableRowActions } from "@/components/data-table-components/data-table-row-actions";
import { IAPICourse } from '@/interface/course.interface'
import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";

export const FormColumns: ColumnDef<IAPICourse>[] = [
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
            <DataTableColumnHeader column={column} title="ID" className="w-[30px] text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-[70px] capitalize">{row.getValue("idNumber")}</div>
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Full Name" className="max-w-[100px] text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className=" truncate capitalize font-medium">
                        {row.getValue("name")}
                    </span>
                </div>
            );
        }
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" className="w-[70px] text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[70px] items-center">
                    <span className="text-center">{row.getValue("email")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "date_sent",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date Sent" className="w-[70px] text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[70px] items-center">
                    <span className="text-center">{row.getValue("date_sent")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "notes",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Notes" className="w-[70px] text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span className="capitalize">{row.getValue("graduation_date")}</span>
                </div>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />
    }
]