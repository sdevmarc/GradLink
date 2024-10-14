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
import { useEffect, useState } from "react"
import { IAPIPrograms } from "@/interface/program.interface"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    fetchAddedPrograms: (e: IAPIPrograms[]) => void
}

export function DataTableToolbarCreateProgram<TData>({
    table,
    fetchAddedPrograms
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const navigate = useNavigate()
    const [values, setValues] = useState<IAPIPrograms[]>([])
    const [programs, setprograms] = useState({
        code: '',
        descriptiveTitle: '',
        residency: ''
    })

    useEffect(() => {
        if (values.length > 0) {
            fetchAddedPrograms(values)
        } else {
            fetchAddedPrograms([])
        }

    }, [values, fetchAddedPrograms])

    const handleSubmit = async () => {
        const { code, descriptiveTitle, residency } = programs
        const upperCode = code.replace(/\s+/g, '').toUpperCase()
        if (upperCode === '' || descriptiveTitle === '' || residency === '') return alert('Please fill-up the required fields.')
        const programExists = values.some(program => program.code === upperCode)

        if (programExists) return alert('A program with this code or descriptive title already exists.')
        setValues(prev => [...prev, { code: upperCode, descriptiveTitle, residency }])
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setprograms((prev) => ({
            ...prev,
            [name]: value
        }))
    }


    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search program..."
                    value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("code")?.setFilterValue(event.target.value);
                    }}
                    className="h-8 w-[20rem] lg:w-[25rem] placeholder:text-muted"
                />
                {/* {table.getColumn("category") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("category")}
                        title="Categoryasdasd"
                        options={categories}
                    />
                )}
                {table.getColumn("type") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("type")}
                        title="Type"
                        options={incomeType}
                    />
                )} */}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
                {/* <CalendarDatePicker
                    date={dateRange}
                    onDateSelect={handleDateSelect}
                    className="w-[250px] h-8"
                    variant="outline"
                /> */}
            </div>
            <div className="flex gap-2 items-center">
                <DialogContainer
                    submit={handleSubmit}
                    title="Add Program"
                    description="Please fill-out the required fields."
                    Trigger={
                        <Button variant={`outline`} size={`sm`}>
                            Add program
                        </Button>
                    }
                    children={
                        <>
                            <Label htmlFor="code">
                                Code
                            </Label>
                            <Input required id="code" name="code" onChange={handleOnChange} placeholder="eg. MIT" className="col-span-3 placeholder:text-muted" />
                            <Label htmlFor="descriptiveTitle">
                                Descriptive Title
                            </Label>
                            <Input required id="descriptiveTitle" name="descriptiveTitle" onChange={handleOnChange} placeholder="eg. Master in Information Technology" className="col-span-3 placeholder:text-muted" />
                            <Label htmlFor="residency">
                                Residency
                            </Label>
                            <Input required id="residency" name="residency" onChange={handleOnChange} placeholder="eg. 4" className="col-span-3 placeholder:text-muted" />
                        </>
                    }
                />
                <AlertDialogConfirmation
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