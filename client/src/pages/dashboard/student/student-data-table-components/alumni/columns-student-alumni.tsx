"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableRowActions } from "@/components/data-table-components/data-table-row-actions";
import { IAPICourse } from '@/interface/course.interface'
import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header";

export const StudentAlumniColumns: ColumnDef<IAPICourse>[] = [
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
                <div className="flex w-[100px] items-center">
                    <span className="text-center">{row.getValue("email")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "graduation_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Graduation Date" className="w-[70px] text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span className="capitalize">{row.getValue("graduation_date")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />
    }
]