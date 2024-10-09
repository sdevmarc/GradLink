"use client"

import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, X } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Cross2Icon } from "@radix-ui/react-icons"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    isAdditional: (e: boolean) => void
}

export function DataTableToolbarEnrollStudent<TData>({
    table,
    isAdditional
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    // const [dateRange, setDateRange] = useState<{ from: Date to: Date }>({
    //     from: new Date(new Date().getFullYear(), 0, 1),
    //     to: new Date()
    // })

    // const handleDateSelect = ({ from, to }: { from: Date to: Date }) => {
    //     setDateRange({ from, to })
    //     // Filter table data based on selected date range
    //     table.getColumn("date")?.setFilterValue([from, to])
    // }

    return (
        <div className="w-full flex justify-between items-center pb-2">
            <div className="w-[50%] flex items-center gap-2">
                <Input
                    placeholder="Filter course..."
                    value={(table.getColumn("courseno")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("courseno")?.setFilterValue(event.target.value)
                    }
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size={`sm`}>
                            Type <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Button onClick={() => isAdditional(false)} type="button" variant={`ghost`} size={`sm`} className="flex items-center gap-3">
                <X size={15} />  Close
            </Button>
        </div>
    )
}