"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { IAPICourse } from '@/interface/course.interface'
import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RightSheetModal } from "@/components/right-sheet-modal"
import { useState } from "react"

export const CurriculumColumns: ColumnDef<IAPICourse>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-full normal-case">{row.getValue("name")}</div>
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
        accessorKey: "major",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Major" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize">
                        {row.getValue("major") === '' ? 'None' : row.getValue("major")}
                    </span>
                </div>
            )
        },
        enableSorting: false
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
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableColumnFilter: true,
        enableSorting: false
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const [isOpen, setIsOpen] = useState<boolean>(false)

            const handleViewDetails = () => {
                setIsOpen(true)
            }

            const handleOpenChange = (open: boolean) => {
                setIsOpen(open)
            }
            return (
                <>
                    <Button onClick={handleViewDetails} variant={`outline`} size={`sm`}>
                        View Details
                    </Button>
                    <RightSheetModal
                        className="w-[60%]"
                        isOpen={isOpen}
                        onOpenChange={handleOpenChange}
                        title="Curriculum Details"
                        description="View details of the selected curriculum."
                        content={''}
                    />
                </>

            )
        }
    }
]