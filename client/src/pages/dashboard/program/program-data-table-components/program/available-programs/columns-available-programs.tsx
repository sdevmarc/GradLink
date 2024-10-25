"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { DataTableRowActionsAvailablePrograms } from "./data-table-row-actions-available-programs"
import { IAPIPrograms } from "@/interface/program.interface"

export const AvailableProgramsColumns: ColumnDef<IAPIPrograms>[] = [
    {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Code" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-[2rem] capitalize">{row.getValue("code")}</div>
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
                    <span className="max-w-[500px] truncate capitalize font-medium">
                        {row.getValue("descriptiveTitle")}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "residency",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Residency" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="capitalize"> {row.getValue("residency")}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableColumnFilter: true
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActionsAvailablePrograms row={row} />
    }
]