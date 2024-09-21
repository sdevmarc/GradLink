"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableRowActions } from "@/components/data-table-components/data-table-row-actions";
import { IAPICourse } from '@/interface/course.interface'
import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";

export const StudentCurrentEnrolledColumns: ColumnDef<IAPICourse>[] = [
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
            <DataTableColumnHeader column={column} title="ID" className=" text-text" />
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
            <DataTableColumnHeader column={column} title="Full Name" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[400px] truncate capitalize font-medium">
                        {row.getValue("name")}
                    </span>
                </div>
            );
        }
    },
    {
        accessorKey: "semester",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Semester" className="w-[1rem] text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[50px] items-center">
                    <span className="text-center">{row.getValue("semester")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "enrollment_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Enrollment Date" className="w-[1rem] text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span className="capitalize">{row.getValue("enrollment_date")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "progress",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Progress" className="w-[1rem] text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[50px] items-center">
                    <span className="capitalize"> {row.getValue("progress")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />
    }
]