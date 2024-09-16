"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DataTableViewOptions } from "@/components/data-table-components/data-table-view-options";
import { AlertDialogConfirmation } from "@/components/alert-dialog";
import { DialogContainer } from "@/components/dialog";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { API_PROGRAM_CREATE } from "@/api/program";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbarStudent<TData>({
    table
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    // const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    //     from: new Date(new Date().getFullYear(), 0, 1),
    //     to: new Date()
    // });

    // const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    //     setDateRange({ from, to });
    //     // Filter table data based on selected date range
    //     table.getColumn("date")?.setFilterValue([from, to]);
    // };

    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [values, setValues] = useState({
        code: '',
        descriptiveTitle: '',
        residency: ''
    })

    const { mutateAsync: upsertProgram, isPending: programLoading } = useMutation({
        mutationFn: API_PROGRAM_CREATE,
        onSuccess: (data) => {
            if (!data.success) return alert(data.message)
            queryClient.invalidateQueries({ queryKey: ['student'] })
            return console.log(data.message)
        }
    })

    const handleSubmit = async () => {
        if (values.code === '' || values.descriptiveTitle === '' || values.residency === '') return alert('Please fill-up the required fields.')
        // await upsertProgram(values)
        console.log(values)
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setValues((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Filter labels..."
                    value={(table.getColumn("idNumber")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("idNumber")?.setFilterValue(event.target.value);
                    }}
                    className="h-8 w-[20rem] lg:w-[25rem] placeholder:text-muted"
                />
                {/* {table.getColumn("category") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("category")}
                        title="Category"
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
                    title="Add Student"
                    description="Please fill-out the required fields."
                    Trigger={
                        <Button variant={`outline`} size={`sm`}>
                            Add Student
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
    );
}