"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table-components/data-table-view-options";
import { DialogContainer } from "@/components/dialog";
import { Label } from "@/components/ui/label";
import { AlertDialogConfirmation } from "@/components/alert-dialog";
import { useNavigate } from "react-router-dom";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbarCourse<TData>({
    table
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const navigate = useNavigate()

    const handleOnChange = () => {

    }

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search courses..."
                    value={(table.getColumn("note")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("note")?.setFilterValue(event.target.value);
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
                    // submit={handleAddQr}
                    title="Add Course"
                    description="Please fill-out the required fields."
                    Trigger={
                        <Button variant={`outline`} size={`sm`}>
                            Add Course
                        </Button>
                    }
                    children={
                        <>
                            <Label htmlFor="courseno" className="text-right">
                                Course Number
                            </Label>
                            <Input required id="courseno" name="courseno" onChange={handleOnChange} placeholder="eg. LIS100" className="col-span-3 placeholder:text-muted" />
                            <Label htmlFor="descriptiveTitle" className="text-right">
                                Descriptive Title
                            </Label>
                            <Input required id="descriptiveTitle" name="descriptiveTitle" onChange={handleOnChange} placeholder="eg. Library in Information System Subject" className="col-span-3 placeholder:text-muted" />
                            <Label htmlFor="degree" className="text-right">
                                Degree
                            </Label>
                            <Input required id="degree" name="degree" onChange={handleOnChange} placeholder="eg. MIT" className="col-span-3 placeholder:text-muted" />
                            <Label htmlFor="units" className="text-right">
                                Units
                            </Label>
                            <Input required id="units" name="units" onChange={handleOnChange} placeholder="eg. 4" className="col-span-3 placeholder:text-muted" />
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