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
import { Bookmark, TableOfContents } from "lucide-react"

export const CurriculumColumns: ColumnDef<IAPICourse>[] = [
    {
        id: "icon",
        cell: () => {
            return (
                <div className="w-0">
                    <Bookmark color="#000000" size={18} />
                </div>
            )

        }
    },
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
        ),
        enableSorting: false,
        enableHiding: false
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
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date Created" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="w-full capitalize">{row.getValue("createdAt")}</div>
            )
        },
        enableColumnFilter: true,
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
                <div className="flex justify-end">
                    <Button onClick={handleViewDetails} variant={`outline`} size={`sm`} className="flex items-center gap-4">
                        <TableOfContents color="#000000" size={18} />  View Details
                    </Button>
                    <RightSheetModal
                        className="w-[60%]"
                        isOpen={isOpen}
                        onOpenChange={handleOpenChange}
                        title="Curriculum Details"
                        description="View details of the selected curriculum."
                        content={''}
                    />
                </div>
            )
        }
    }
]