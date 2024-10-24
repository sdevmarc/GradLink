"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-components/data-table-view-options"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { useNavigate } from "react-router-dom"
import { DialogContainer } from "@/components/dialog"
import { Label } from "@/components/ui/label"

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

    const handleAddStudent = () => {

    }

    const handleOnChange = () => {

    }

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
                <DialogContainer
                    submit={handleAddStudent}
                    title="New Student"
                    description="Please fill-out the required fields."
                    Trigger={
                        <Button variant={`outline`} size={`sm`}>
                            New Student
                        </Button>
                    }
                    children={
                        <>
                            <Label htmlFor="idNumber">
                                ID Number
                            </Label>
                            <Input required id="idNumber" name="idNumber" onChange={handleOnChange} placeholder="eg. 123" className="col-span-3 placeholder:text-muted" />
                            <Label htmlFor="lastname">
                                Last Name
                            </Label>
                            <Input required id="lastname" name="lastname" onChange={handleOnChange} placeholder="eg. Nueva" className="col-span-3 placeholder:text-muted" />
                            <Label htmlFor="firstname">
                                First Name
                            </Label>
                            <Input required id="firstname" name="firstname" onChange={handleOnChange} placeholder="eg. Jericho" className="col-span-3 placeholder:text-muted" />
                            <Label htmlFor="middlename">
                                Middle Name
                            </Label>
                            <Input required id="middlename" name="middlename" onChange={handleOnChange} placeholder="eg. Arman" className="col-span-3 placeholder:text-muted" />
                            <Label htmlFor="email">
                                Email
                            </Label>
                            <Input required id="email" type="email" name="email" onChange={handleOnChange} placeholder="m@example.com" className="col-span-3 placeholder:text-muted" />
                        </>
                    }
                />
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