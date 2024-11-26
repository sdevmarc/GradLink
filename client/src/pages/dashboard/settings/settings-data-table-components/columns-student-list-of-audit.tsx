"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { IAPIStudents } from "@/interface/student.interface"
import { Badge } from "@/components/ui/badge"

export const AuditColumns: ColumnDef<IAPIStudents>[] = [
    {
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Timestamp" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize font-mono text-xs">
                        {new Date(row.getValue("updatedAt")).toLocaleString()}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        filterFn: "includesString"
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="User" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize">
                        {row.getValue("name")}
                    </span>
                </div>
            )
        },
        enableSorting: false,
        enableColumnFilter: true,
        filterFn: "includesString"
    },
    {
        accessorKey: "action",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Action" className="text-primary flex items-center justify-start" />
        ),
        cell: ({ row }) => (
            <div className="flex justify-start items-center capitalize gap-4 text-primary">
                <Badge variant={`outline`} className="font-medium">
                    {row.getValue("action") === 'user_login' && 'User Login'}
                    {row.getValue("action") === 'settings_changed' && 'Settings Changed'}
                    {row.getValue("action") === 'user_created' && 'User Created'}
                    {row.getValue("action") === 'password_changed' && 'Password Changed'}
                    {row.getValue("action") === 'program_changed' && 'Program Changed'}
                    {row.getValue("action") === 'course_changed' && 'Course Changed'}
                    {row.getValue("action") === 'curriculum_changed' && 'Curriculum Changed'}
                    {row.getValue("action") === 'semester_changed' && 'Semester Changed'}
                    {row.getValue("action") === 'student_changed' && 'Student Changed'}
                </Badge>
            </div>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableColumnFilter: true,
        enableSorting: false,
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize">
                        {row.getValue("description")}
                    </span>
                </div>
            )
        },
        enableSorting: false,
        enableColumnFilter: true,
        filterFn: "includesString"
    },
]