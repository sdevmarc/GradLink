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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { API_COURSE_UPSERT } from "@/api/courses";
import { ComboBox } from "@/components/combo-box";
import { API_PROGRAM_FINDALL } from "@/api/program";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbarCourse<TData>({
    table
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const [lists, setList] = useState([])
    const [isDegree, setDegree] = useState<string>('')
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [values, setValues] = useState({
        courseno: '',
        descriptiveTitle: '',
        degree: '',
        units: 0
    })

    const { data: programs, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['program']
    })

    useEffect(() => {
        if (programFetched && !programLoading) {
            const newList = programs.data.map((item: { code: string, descriptiveTitle: string }) => {
                const value = item.code;
                const label = item.descriptiveTitle;
                return { value, label };
            });
            setList(newList);
        }
    }, [programFetched, programLoading, programs]);



    const { mutateAsync: upsertCourse, isPending: courseLoading } = useMutation({
        mutationFn: API_COURSE_UPSERT,
        onSuccess: (data) => {
            console.log(data)
            if (!data.success) return alert(data.message)
            queryClient.invalidateQueries({ queryKey: ['course'] })
            setDegree('')
            setValues({
                courseno: '',
                descriptiveTitle: '',
                degree: '',
                units: 0
            })
            return console.log(data.message)
        }
    })

    const handleSubmit = async () => {
        const { courseno, descriptiveTitle, degree, units } = values;
        if (isNaN(units)) return alert('Units should be a number.')
        if (courseno === '' || descriptiveTitle === '' || degree === '') return alert('Please fill-up the required fields.')
        await upsertCourse(values)
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
                    placeholder="Search courses..."
                    value={(table.getColumn("courseno")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("courseno")?.setFilterValue(event.target.value);
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
                    title="Add Course"
                    description="Please fill-out the required fields."
                    Trigger={
                        <Button variant={`outline`} size={`sm`}>
                            Add Course
                        </Button>
                    }
                    children={
                        <>
                            <Label htmlFor="courseno">
                                Course Number
                            </Label>
                            <Input required id="courseno" name="courseno" onChange={handleOnChange} placeholder="eg. LIS100" className="col-span-3 placeholder:text-muted" />
                            <Label htmlFor="descriptiveTitle">
                                Descriptive Title
                            </Label>
                            <Input required id="descriptiveTitle" name="descriptiveTitle" onChange={handleOnChange} placeholder="eg. Library in Information System Subject" className="col-span-3 placeholder:text-muted" />
                            <div className="w-full flex justify-between items-center gap-4">
                                <h1 className="text-sm font-medium">Degree</h1>
                                {programLoading && <div>Loading...</div>}
                                {
                                    programFetched &&
                                    <ComboBox
                                        type={
                                            (e) => {
                                                setDegree(e || '')
                                                setValues((prev) => ({
                                                    ...prev,
                                                    degree: e || ''
                                                }))
                                            }
                                        }
                                        title='None'
                                        lists={lists || []}
                                        value={isDegree}
                                    />}

                            </div>

                            {/* <Label htmlFor="degree">
                                Degree
                            </Label>
                            <Input required id="degree" name="degree" onChange={handleOnChange} placeholder="eg. MIT" className="col-span-3 placeholder:text-muted" /> */}

                            <Label htmlFor="units">
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