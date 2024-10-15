"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { DialogContainer } from "@/components/dialog"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { IAPIPrograms } from "@/interface/program.interface"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { API_PROGRAM_ADD_PROGRAM } from "@/api/program"
import ContinueDialog from "@/components/continue-dialog"
import { CircleCheck, CircleX } from "lucide-react"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    fetchAddedPrograms: (e: IAPIPrograms[]) => void
    isrows: boolean
    fetchChecks: IAPIPrograms[]
}

export function DataTableToolbarCreateProgramInCurriculum<TData>({
    table,
    fetchAddedPrograms,
    isrows,
    fetchChecks
}: DataTableToolbarProps<TData>) {
    const queryClient = useQueryClient()
    const isFiltered = table.getState().columnFilters.length > 0
    const [values, setValues] = useState<IAPIPrograms[]>([])
    const [programs, setprograms] = useState({
        code: '',
        descriptiveTitle: '',
        residency: ''
    })
    const [dialogState, setDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })

    useEffect(() => {
        if (values.length > 0) {
            fetchAddedPrograms(values)
        } else {
            fetchAddedPrograms([])
        }

    }, [values, fetchAddedPrograms])

    useEffect(() => {
        console.log('Fetched checks: ', fetchChecks)
    }, [fetchChecks])

    const handleAddProgram = async () => {
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

    const handleRemoveProgram = () => {
        fetchChecks.map(item => {
            const { code } = item
            setValues(prev => prev.filter(program => program.code !== code))
            table.resetRowSelection()
        })
    }

    const { mutateAsync: addprogram, isPending: programLoading } = useMutation({
        mutationFn: API_PROGRAM_ADD_PROGRAM,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
            } else {
                await queryClient.invalidateQueries({ queryKey: ['programs'] })
                await queryClient.refetchQueries({ queryKey: ['programs'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setDialogState({ success: true, show: true, title: data.message, description: 'Do you want to continue creating course?' })
                setValues([])
                setprograms({ code: '', descriptiveTitle: '', residency: '' })
            }
        },
        onError: (data) => {
            setDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleSubmit = async () => {
        if (values.length === 0) return alert('Please add at least one program to submit.')
        await addprogram({ programs: values })
    }

    return (
        <div className="flex flex-wrap items-center justify-between">
            <ContinueDialog
                icon={dialogState.success ? <CircleCheck color="#42a626" size={70} /> : <CircleX color="#880808" size={70} />}
                trigger={dialogState.show}
                title={dialogState.title}
                description={dialogState.description}
                onClose={() => { setDialogState(prev => ({ ...prev, show: false })) }}
            />
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search program..."
                    value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("code")?.setFilterValue(event.target.value)
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
                {
                    isrows &&
                    <Button onClick={handleRemoveProgram} variant={`outline`} size={`sm`} type="button">
                        Remove
                    </Button>
                }
                {/* <CalendarDatePicker
                    date={dateRange}
                    onDateSelect={handleDateSelect}
                    className="w-[250px] h-8"
                    variant="outline"
                /> */}
            </div>
            <div className="flex gap-2 items-center">
                <DialogContainer
                    submit={handleAddProgram}
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
                {
                    values.length > 0 &&
                    <AlertDialogConfirmation
                        variant={'outline'}
                        btnTitle="Submit"
                        title="Are you sure?"
                        description={`This will add new programs to the current curriculum.`}
                        btnContinue={handleSubmit}
                    />
                }
                {/* <DataTableViewOptions table={table} /> */}
            </div>
        </div>
    )
}