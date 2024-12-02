"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/data-table-components/data-table-faceted-filter"
import { Copy, LoaderCircle, Trash2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { API_FORM_GET_GOOGLE_FORM_LINK } from "@/api/form"
import { toast } from "sonner" // Add this import at the top
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { ROUTES } from "@/constants"
import { useNavigate } from "react-router-dom"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    isSync: boolean
}

export function DataTableToolbarAlumniGoogleForm<TData>({
    table,
    isSync
}: DataTableToolbarProps<TData>) {
    const navigate = useNavigate()
    const isFiltered = table.getState().columnFilters.length > 0

    const department_options = [
        { value: 'SEAIT', label: "Eng'g, Dev't. Arts & Design, Library Science & IT" },
        { value: 'SHANS', label: "Science and Mathematics" },
        { value: 'SAB', label: "Business and Accountancy" },
        { value: 'STEH', label: "Teacher Education and Humanities" }
    ]

    const { data: googleform, isFetched: googleformFetched } = useQuery({
        queryFn: () => API_FORM_GET_GOOGLE_FORM_LINK(),
        queryKey: ['google-form']
    })


    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(googleform.data)
        toast.success("Link copied to clipboard!")
    }

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search ID Number"
                        value={(table.getColumn("idNumber")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => {
                            table.getColumn("idNumber")?.setFilterValue(event.target.value)
                        }}
                        className="h-8 w-[17rem] lg:w-[20rem]"
                    />

                    <div className="flex items-center gap-2">
                        {table.getColumn("department") && (
                            <DataTableFacetedFilter
                                column={table.getColumn("department")}
                                title="Department"
                                options={department_options}
                            />
                        )}
                    </div>
                </div>

                {
                    isSync &&
                    <div className="flex items-center gap-2">

                        <LoaderCircle className={`text-muted-foreground animate-spin`} size={18} />
                        <h1 className="text-muted-foreground text-sm">
                            Syncing
                        </h1>
                    </div>
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


                <div className="flex gap-2 items-center">
                    {
                        googleformFetched &&
                        <div className="flex gap-2 items-center">
                            <Button
                                onClick={handleCopyLink}
                                variant={`outline`}
                                size={`sm`}
                                className="flex items-center gap-2"
                            >
                              <Copy className="text-primary" size={18} />  Copy Google Form Link
                            </Button>
                        </div>
                    }
                    <AlertDialogConfirmation
                        className="flex items-center gap-2"
                        type={`default`}
                        variant={'outline'}
                        btnIcon={<Trash2 className="text-primary" size={18} />}
                        btnTitle="Trash"
                        title="Are you sure?"
                        description={`This action will redirect you to a page for trashed or declined respondents.`}
                        btnContinue={() => navigate(ROUTES.NEW_STUDENT)}
                    />
                </div>
            </div>
        </div>
    )
}