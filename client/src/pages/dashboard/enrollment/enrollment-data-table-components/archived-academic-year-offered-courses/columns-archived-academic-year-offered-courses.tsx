"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { IAPIOffered } from "@/interface/offered.interface"
import { Badge } from "@/components/ui/badge"
import { ChartColumnBig, TableOfContents } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AlertDialogConfirmation } from "@/components/alert-dialog"

export const ArchivedAcademicYearOfferedCoursesColumns: ColumnDef<IAPIOffered>[] = [
    {
        id: "icon",
        cell: () => {
            return (
                <div className="w-0">
                    <ChartColumnBig className="text-primary" size={18} />
                </div>
            )

        }
    },
    {
        accessorKey: "_id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Academic Year" className="text-text" />
        ),
        cell: ({ row }) => (
            <div className="flex justify-start items-center capitalize gap-4 ">
                <Badge variant={`default`}>
                    {row.getValue("_id")}
                </Badge>
            </div>
        ),
        enableHiding: false
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const navigate = useNavigate()

            const handleNavigateToSemestersInAcademicYear = () => {
                const id = (row.original as any).offeredId
                const academicYear = (row.original as any)._id
                console.log('The academic year: ', academicYear)
                const combinedString = JSON.stringify({ id, academicYear });
                const base64ID = btoa(combinedString)
                
                navigate(`/enrollment/archived-semesters-in-academic-year/${base64ID}`)
            }

            return (
                <div className="flex justify-end">
                    <AlertDialogConfirmation
                        className="flex items-center gap-2"
                        type={`default`}
                        variant={'outline'}
                        btnIcon={<TableOfContents className="text-primary" size={18} />}
                        btnTitle="View Academic Year"
                        title="Are you sure?"
                        description={`You will be redirect to a page for viewing the past offered courses.`}
                        btnContinue={handleNavigateToSemestersInAcademicYear}
                    />
                </div>
            )
        }
    }
]