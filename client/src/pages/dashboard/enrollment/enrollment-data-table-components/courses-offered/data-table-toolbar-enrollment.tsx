"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
interface DataTableToolbarProps<TData> {
    table: Table<TData>
    isenroll: boolean
    setEnroll: (e: boolean) => void
}

export function DataTableToolbarCoursesOfferedInEnrollment<TData>({
    table,
    isenroll,
    setEnroll
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const navigate = useNavigate()

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search course number..."
                    value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("code")?.setFilterValue(event.target.value);
                    }}
                    className="h-8 w-[20rem] lg:w-[25rem]"
                />
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
                {/* {(table.getColumn("program") && programFetched) && (
                    <DataTableFacetedFilter
                        column={table.getColumn("program")}
                        title="Program"
                        options={filteredPrograms}
                    />
                )} */}
            </div>
            <div className="flex gap-2 items-center">
                <div className="flex items-center space-x-2">
                    {/* <Switch checked={true} id="airplane-mode" /> */}
                    <Switch id="airplane-mode" checked={isenroll} onCheckedChange={setEnroll} />
                    <Label htmlFor="airplane-mode">Enroll Mode</Label>
                </div>
                <AlertDialogConfirmation
                    className="flex items-center gap-2"
                    type={`default`}
                    variant={'outline'}
                    btnIcon={<Plus color="#000000" size={18} />}
                    btnTitle="New Courses Offered"
                    title="Are you sure?"
                    description={`You will be redirect to a page for creating new courses offered.`}
                    btnContinue={() => navigate(ROUTES.CREATE_COURSE_OFFERED)}
                />

                <AlertDialogConfirmation
                    type={`default`}
                    variant={'outline'}
                    btnTitle="Export"
                    title="Are you sure?"
                    description={`This will export the current data you are viewing.`}
                    btnContinue={() => navigate('/program')}
                />
            </div>
        </div>
    )
}