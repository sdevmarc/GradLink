"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { useNavigate } from "react-router-dom"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { IAPIOffered } from "@/interface/offered.interface"
import { HandHelping } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const CoursesOfferedInEnrollmentColumns = (isenroll: boolean): ColumnDef<IAPIOffered>[] => [
    {
        id: "icon",
        cell: () => {
            return (
                <div className="w-0">
                    <HandHelping color="#000000" size={18} />
                </div>
            )

        }
    },
    {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Code" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="flex justify-start items-center capitalize gap-4 ">
                <Badge variant={`default`}>
                    {row.getValue("code")}
                </Badge>
            </div>
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
            const navigate = useNavigate()
            const id = (row.original as any)._id
            const descriptiveTitle = (row.original as any).descriptiveTitle

            const handleNavigateEnrollStudent = () => {
                const combinedString = JSON.stringify({ id, descriptiveTitle });
                const base64ID = btoa(combinedString)

                navigate(`/enrollment/enroll-student/${base64ID}`)
            }
            return (
                <AlertDialogConfirmation
                    type="default"
                    variant={isenroll ? 'default' : 'destructive'}
                    btnTitle={isenroll ? "Enroll Student" : "Evaluate Student"}
                    title="Are you sure?"
                    description={isenroll
                        ? `You will be redirected to a page for enrolling students in ${descriptiveTitle}`
                        : `You will be redirected to a page for evaluating students in ${descriptiveTitle}`
                    }
                    btnContinue={handleNavigateEnrollStudent}
                />
            )
        }
    }
]