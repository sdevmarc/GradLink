"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-components/data-table-view-options"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants"
import { useQuery } from "@tanstack/react-query"
import { API_SEMESTER_ISEXISTS } from "@/api/curriculum"
import { useEffect, useState } from "react"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    isrows: boolean
}

export function DataTableToolbarCurrentlyEnrolled<TData>({
    table,
    isrows
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const navigate = useNavigate()
    const [isSem, setSem] = useState<boolean>(false)

    const { data: issemester, isFetched: issemesterFetched } = useQuery({
        queryFn: () => API_SEMESTER_ISEXISTS(),
        queryKey: ['semester_exists']
    })

    useEffect(() => {
        if (issemesterFetched && issemester.success) {
            setSem(true)
        }
    }, [])

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search for ID Number..."
                    value={(table.getColumn("idNumber")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("idNumber")?.setFilterValue(event.target.value);
                    }}
                    className="h-8 w-[20rem] lg:w-[25rem] placeholder:text-muted"
                />
                {
                    isrows && <Button variant={`outline`} size={`sm`} type="button">
                        Withdraw
                    </Button>
                }
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                        size={`sm`}
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex gap-2 items-center">
                <AlertDialogConfirmation
                    type={`default`}
                    variant={'outline'}
                    btnTitle="Add Student"
                    title="Are you sure?"
                    description={`You will be redirect to a page for creating a new student for the current semester.`}
                    btnContinue={() => navigate(ROUTES.CREATE_STUDENT)}
                />
                {
                    isSem &&
                    <AlertDialogConfirmation
                        type={`default`}
                        variant={'outline'}
                        btnTitle="New Semester"
                        title="Are you sure?"
                        description={`You will be redirect to a page for creating a new student for the new semester.`}
                        btnContinue={() => navigate(ROUTES.CREATE_STUDENT)}
                    />
                }

                <AlertDialogConfirmation
                    type={`default`}
                    variant={'outline'}
                    btnTitle="Export"
                    title="Are you sure?"
                    description={`This will export the current data you are viewing.`}
                    btnContinue={() => navigate('/program')}
                />
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}