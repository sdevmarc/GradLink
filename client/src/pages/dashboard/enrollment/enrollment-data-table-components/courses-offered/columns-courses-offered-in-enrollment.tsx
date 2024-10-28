"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { IAPICourse } from '@/interface/course.interface'
import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { useNavigate } from "react-router-dom"
import { AlertDialogConfirmation } from "@/components/alert-dialog"

export const CoursesOfferedInEnrollmentColumns = (isenroll: boolean): ColumnDef<IAPICourse>[] => [
    {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Code" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-[100px] capitalize">{row.getValue("code")}</div>
        )
    },
    {
        accessorKey: "courseno",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Course No." className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="w-[100px] capitalize">{row.getValue("courseno")}</div>
        )
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
        }
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
                    variant={isenroll ? 'default' : 'outline'}
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