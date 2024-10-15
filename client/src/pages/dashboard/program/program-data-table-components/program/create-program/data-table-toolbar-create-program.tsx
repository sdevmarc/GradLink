"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogContainer } from "@/components/dialog"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { IAPIPrograms } from "@/interface/program.interface"
import ContinueDialog from "@/components/continue-dialog"
import { CircleCheck, CircleX } from "lucide-react"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    fetchAddedPrograms: (e: IAPIPrograms[]) => void
    isrows: boolean
    fetchChecks: IAPIPrograms[]
    isreset: boolean
}

export function DataTableToolbarCreateProgram<TData>({
    table,
    fetchAddedPrograms,
    isrows,
    fetchChecks,
    isreset
}: DataTableToolbarProps<TData>) {
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
        if (isreset) {
            setValues([])
            setprograms({ code: '', descriptiveTitle: '', residency: '' })
        }
    }, [isreset])

    const handleAddProgram = async () => {
        const { code, descriptiveTitle, residency } = programs
        const upperCode = code.replace(/\s+/g, '').toUpperCase()
        if (upperCode === '' || descriptiveTitle === '' || residency === '') return setDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please fill-up the required fields.' })
        const programExists = values.some(program => program.code === upperCode)

        if (programExists) return setDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'A program with this code or descriptive title already exists.' })
        setValues(prev => [...prev, { code: upperCode, descriptiveTitle, residency }])
        setprograms({ code: '', descriptiveTitle: '', residency: '' })
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
                    <Button onClick={handleRemoveProgram} variant={`default`} size={`sm`} type="button">
                        Remove
                    </Button>
                }
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
            </div>
        </div>
    )
}