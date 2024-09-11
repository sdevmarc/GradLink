"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Expense } from "@/components/data-table-components/schema";
import { DataTableRowActions } from "@/components/data-table-components/data-table-row-actions";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "../data-table-column-header";

export const AlumniColumns: ColumnDef<Expense>[] = [
    {
        accessorKey: "label",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Label" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-[150px] capitalize">{row.getValue("label")}</div>
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "note",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Note" className="text-text" />
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
            <DataTableColumnHeader column={column} title="Category" className="text-text" />
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
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" className="text-text" />
        ),
        cell: ({ row }) => {
            const type = row.getValue("type");
            return (
                <div className="flex w-[100px] items-center">
                    {type === "income" ? (
                        <TrendingUp size={20} className="mr-2 text-green-500" />
                    ) : (
                        <TrendingDown size={20} className="mr-2 text-red-500" />
                    )}
                    <span className="capitalize"> {row.getValue("type")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "amount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" className="text-text" />
        ),
        cell: ({ row }) => {
            const type = row.getValue("type");
            return (
                <div className="flex w-[100px] items-center">
                    <span
                        className={cn(
                            "capitalize",
                            type === "income" ? "text-green-500" : "text-red-500"
                        )}
                    >
                        {" "}
                        {row.getValue("amount")}
                    </span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" className="text-text" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("date"));
            const formattedDate = date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
            return (
                <div className="flex w-[100px] items-center">
                    <span className="capitalize">{formattedDate}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            const rowDate = new Date(row.getValue(id));
            const [startDate, endDate] = value;
            return rowDate >= startDate && rowDate <= endDate;
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />
    }
];