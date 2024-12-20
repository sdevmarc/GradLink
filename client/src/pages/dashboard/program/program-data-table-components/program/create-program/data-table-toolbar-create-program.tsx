"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogContainer } from "@/components/dialog"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { IAPIPrograms } from "@/interface/program.interface"
import { CircleCheck, CircleX } from "lucide-react"
import { AlertDialogConfirmation } from "@/components/alert-dialog"

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
    const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter;
    const [values, setValues] = useState<IAPIPrograms[]>([])
    const [programs, setprograms] = useState({
        code: '',
        descriptiveTitle: '',
        residency: ''
    })
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })
    const [dialogOpen, setDialogOpen] = useState(false)

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
        if (upperCode === '' || descriptiveTitle === '' || residency === '') {
            setAlertDialogState({
                success: false,
                show: true,
                title: 'Uh, oh! Something went wrong.',
                description: 'Please fill-up the required fields.'
            })
            return
        }
        const programExists = values.some(program => program.code === upperCode)

        if (programExists) {
            setAlertDialogState({
                success: false,
                show: true,
                title: 'Uh, oh! Something went wrong.',
                description: 'A program with this code or descriptive title already exists.'
            })
            return
        }
        setValues(prev => [...prev, { code: upperCode, descriptiveTitle, residency }])
        setprograms({ code: '', descriptiveTitle: '', residency: '' })
        setDialogOpen(false)
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
            <AlertDialogConfirmation
                btnTitle='Continue'
                className='w-full py-4'
                isDialog={alertdialogstate.show}
                setDialog={(open) => setAlertDialogState(prev => ({ ...prev, show: open }))}
                type={`alert`}
                title={alertdialogstate.title}
                description={alertdialogstate.description}
                icon={alertdialogstate.success ? <CircleCheck color="#42a626" size={70} /> : <CircleX color="#880808" size={70} />}
                variant={`default`}
                btnContinue={() => { setAlertDialogState(prev => ({ ...prev, show: false })) }}
            />
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search program..."
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
                {
                    isrows &&
                    <Button onClick={handleRemoveProgram} variant={`default`} size={`sm`} type="button">
                        Remove
                    </Button>
                }
            </div>
            <div className="flex gap-2 items-center">
                <DialogContainer
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
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
                            <Input value={programs.code} required id="code" name="code" onChange={handleOnChange} placeholder="eg. MIT" className="col-span-3 placeholder:text-muted" />
                            <Label htmlFor="descriptiveTitle">
                                Descriptive Title
                            </Label>
                            <Input value={programs.descriptiveTitle} required id="descriptiveTitle" name="descriptiveTitle" onChange={handleOnChange} placeholder="eg. Master in Information Technology" className="col-span-3 placeholder:text-muted" />
                            <Label htmlFor="residency">
                                Residency
                            </Label>
                            <Input value={programs.residency} required id="residency" name="residency" onChange={handleOnChange} placeholder="eg. 4" className="col-span-3 placeholder:text-muted" />
                        </>
                    }
                />
            </div>
        </div>
    )
}