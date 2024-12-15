"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header";
import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IAPIStudents } from "@/interface/student.interface";

export const OverviewLandJobColumns: ColumnDef<IAPIStudents>[] = [
    {
        id: "icon",
        cell: () => {
            return (
                <div className="w-0 px-1">
                    <GraduationCap className="text-primary" size={18} />
                </div>
            )

        }
    },
    {
        accessorKey: "idNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID No." className="text-primary flex items-center justify-start" />
        ),
        cell: ({ row }) => (
            <div className="flex justify-start items-center capitalize gap-4 ">
                <Badge variant={`default`}>
                    {row.getValue("idNumber") ? row.getValue("idNumber") : 'LEGACY'}
                </Badge>
            </div>
        )
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" className="text-primary flex justify-start items-center" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex flex-col items-start justify-center">
                    <span className="flex items-center uppercase font-medium text-sm justify-end">
                        {row.getValue("name")}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        filterFn: "includesString"
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[100px] truncate lowercase">
                        {row.getValue("email")}
                    </span>
                </div>
            )
        },
        enableSorting: false,
    },
    {
        accessorKey: "YearGraduated",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Year Graduated" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span className="capitalize">
                        {row.getValue("YearGraduated")}
                    </span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            const idNumber = row.getValue('idNumber');

            if (!idNumber) return false;
            return value.includes(row.getValue(id))
        },
        enableSorting: false,
    },
    {
        accessorKey: "program",
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
            const idNumber = row.getValue('idNumber');

            if (!idNumber) return false;
            return value.includes(row.getValue(id))
        },
        enableHiding: true,
        enableSorting: false,
    },
]