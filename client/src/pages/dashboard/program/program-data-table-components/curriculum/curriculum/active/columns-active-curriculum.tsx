"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { IAPICourse } from '@/interface/course.interface'
import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { DataTableRowActionsActiveCurriculum } from "./data-table-row-actions-active-curriculum"

export const ActiveCurriculumColumns: ColumnDef<IAPICourse>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-full capitalize">{row.getValue("name")}</div>
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "program",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Program" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-full capitalize">{row.getValue("program")}</div>
        )
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize font-medium">
                        <Badge variant={row.getValue("isActive") === true ? "default" : "destructive"}>
                            {row.getValue("isActive") === true ? 'Active' : 'Legacy'}
                        </Badge>
                    </span>
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActionsActiveCurriculum row={row} />
    }
]