"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { IAPICourse } from '@/interface/course.interface'
import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActionsCurrentEnrolled } from "./data-table-row-actions-currently-enrolled";

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
    },
    {
        accessorKey: "lastname",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Name" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[400px] truncate capitalize">
                        {row.getValue("lastname")}
                    </span>
                </div>
            );
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
                    <span className="max-w-[400px] truncate capitalize">
                        {row.getValue("firstname")}
                    </span>
                </div>
            );
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
                    <span className="max-w-[400px] truncate capitalize">
                        {row.getValue("middlename")}
                    </span>
                </div>
            );
        }
    },
    // {
    //     accessorKey: "enrollment_date",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Enrollment Date" className="w-[1rem] text-text" />
    //     ),
    //     cell: ({ row }) => {
    //         return (
    //             <div className="flex items-center">
    //                 <span className="normal-case">{row.getValue("enrollment_date")}</span>
    //             </div>
    //         );
    //     },
    //     filterFn: (row, id, value) => {
    //         return value.includes(row.getValue(id));
    //     },
    // },
    // {
    //     accessorKey: "progress",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Progress" className="w-[1rem] text-text" />
    //     ),
    //     cell: ({ row }) => {
    //         return (
    //             <div className="flex w-[50px] items-center">
    //                 <span className="capitalize"> {row.getValue("progress")}</span>
    //             </div>
    //         );
    //     },
    //     filterFn: (row, id, value) => {
    //         return value.includes(row.getValue(id));
    //     }
    // },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActionsCurrentEnrolled row={row} />
    }
]