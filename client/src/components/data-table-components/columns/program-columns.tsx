"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Expense } from "@/components/data-table-components/schema";
import { DataTableRowActions } from "@/components/data-table-components/data-table-row-actions";
import { DataTableColumnHeader } from "../data-table-column-header";

export const ProgramColumns: ColumnDef<Expense>[] = [
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
            );
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