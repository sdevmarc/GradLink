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
import { useQuery } from "@tanstack/react-query"
import { API_FINDONE_SETTINGS } from "@/api/settings"

export const CoursesOfferedInEnrollmentColumns: ColumnDef<IAPIOffered>[] = [
    {
        id: "icon",
        cell: () => {
            return (
                <div className="w-0">
                    <HandHelping className="text-primary" size={18} />
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
                    <span className="capitalize">{row.getValue("units")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableColumnFilter: true
    },
    {
        accessorKey: "program",
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableHiding: true,
        enableSorting: false,
    },
    {
        accessorKey: "department",
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableHiding: true,
        enableSorting: false,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const navigate = useNavigate()
            const id = (row.original as any)._id
            const descriptiveTitle = (row.original as any).descriptiveTitle

            const { data: settings, isLoading: settingsLoading, isFetched: settingsFetched } = useQuery({
                queryFn: () => API_FINDONE_SETTINGS(),
                queryKey: ['settings']
            })

            const handleNavigateEnrollStudent = () => {
                const combinedString = JSON.stringify({ id, descriptiveTitle });
                const base64ID = btoa(combinedString)

                navigate(`/enrollment/enroll-student/${base64ID}`)
            }

            const handleNavigateEvaluateStudent = () => {
                const combinedString = JSON.stringify({ id, descriptiveTitle });
                const base64ID = btoa(combinedString)

                navigate(`/enrollment/evaluate-student/${base64ID}`)
            }

            return (
                (!settingsLoading && settingsFetched) && 
                <AlertDialogConfirmation
                    type="default"
                    variant={settings?.data?.isenroll ? 'default' : 'destructive'}
                    btnTitle={settings?.data?.isenroll ? "Enroll Student" : "Evaluate Student"}
                    title="Are you sure?"
                    description={settings?.data?.isenroll
                        ? `You will be redirected to a page for enrolling students in ${descriptiveTitle}`
                        : `You will be redirected to a page for evaluating students in ${descriptiveTitle}`
                    }
                    btnContinue={
                        settings?.data?.isenroll
                            ? handleNavigateEnrollStudent
                            : handleNavigateEvaluateStudent
                    }
                />
            )
        }
    }
]