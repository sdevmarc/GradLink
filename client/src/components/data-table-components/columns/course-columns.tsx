"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Expense } from "@/components/data-table-components/schema";
import { DataTableRowActions } from "@/components/data-table-components/data-table-row-actions";
import { DataTableColumnHeader } from "../data-table-column-header";

export const CourseColumns: ColumnDef<Expense>[] = [
    {
        accessorKey: "label",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Code" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-[2rem] capitalize">{row.getValue("label")}</div>
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "note",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Descriptive Title" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate capitalize font-medium">
                        {row.getValue("note")}
                    </span>
                </div>
            );
        }
    },
    {
        accessorKey: "category",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Residency" className="text-text" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="capitalize"> {row.getValue("category")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />
    }
];