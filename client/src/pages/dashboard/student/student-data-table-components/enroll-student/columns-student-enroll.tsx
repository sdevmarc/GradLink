"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { IAPICourse } from '@/interface/course.interface'
import { Checkbox } from "@/components/ui/checkbox";

export const StudentCourseColumns: ColumnDef<IAPICourse>[] = [
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
        accessorKey: "courseno",
        header: "Course No.",
        cell: ({ row }) => (
            <div>{row.getValue("courseno")}</div>
        ),
    },
    {
        accessorKey: "descriptiveTitle",
        header: 'Descriptive Title',
        cell: ({ row }) => <div className="capitalize">{row.getValue("descriptiveTitle")}</div>,
    },
    {
        accessorKey: "units",
        header: 'Units',
        cell: ({ row }) => (
            <div>{row.getValue("units")}</div>
        ),
    },
    {
        accessorKey: "units",
        header: 'Status',
        cell: ({ row }) => (
            <div>
                <h1>Ongoing</h1>
            </div>
        ),
    }
]