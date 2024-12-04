"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants"
import { Plus } from "lucide-react"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbarAvailableCourses<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter;
    const navigate = useNavigate()

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search courses..."
                    value={(table.getState().globalFilter as string) ?? ""}
                    onChange={(event) => {
                        table.setGlobalFilter(event.target.value);
                    }}
                    className="h-8 w-[20rem] lg:w-[25rem]"
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            table.resetColumnFilters()
                            table.setGlobalFilter('')
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex gap-2 items-center">
                <AlertDialogConfirmation
                    className="flex items-center gap-2"
                    type={`default`}
                    variant={'outline'}
                    btnIcon={<Plus className="text-primary" size={18} />}
                    btnTitle="New Course"
                    title="Are you sure?"
                    description={`You will be redirect to a page for creating a course.`}
                    btnContinue={() => navigate(ROUTES.CREATE_COURSE)}
                />
            </div>
        </div>
    )
}