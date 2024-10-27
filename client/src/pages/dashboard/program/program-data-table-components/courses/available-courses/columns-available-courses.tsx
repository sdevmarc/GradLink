"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { IAPICourse } from '@/interface/course.interface'
import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { DataTableRowActionsAvailableCourses } from "./data-table-row-actions-available-courses"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RightSheetModal } from "@/components/right-sheet-modal"

export const AvailableCoursesColumns: ColumnDef<IAPICourse>[] = [
    {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Code" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-[100px] capitalize">{row.getValue("code")}</div>
        ),
        enableHiding: false
    },
    {
        accessorKey: "courseno",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Course No." className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-[100px] capitalize">{row.getValue("courseno")}</div>
        ),
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
                    <span className="max-w-[200px] truncate capitalize">
                        {row.getValue("descriptiveTitle")}
                    </span>
                </div>
            );
        }
    },
    {
        accessorKey: "units",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Units" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[60px] items-center">
                    <span className="capitalize"> {row.getValue("units")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableColumnFilter: true
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
                        title="Course Details"
                        description="View details of the selected course."
                        content={''}
                    />
                </>

            )
        }
    }
]