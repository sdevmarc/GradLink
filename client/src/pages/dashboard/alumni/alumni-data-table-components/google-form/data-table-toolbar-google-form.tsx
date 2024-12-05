"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Trash2 } from "lucide-react"
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
}: DataTableToolbarProps<TData>) {
    const navigate = useNavigate()
    const isFiltered = table.getState().columnFilters.length > 0

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
                        placeholder="Search tracer"
                        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => {
                            table.getColumn("email")?.setFilterValue(event.target.value)
                        }}
                        className="h-8 w-[17rem] lg:w-[20rem]"
                    />


                </div>


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
                        btnTitle="Rejects"
                        title="Are you sure?"
                        description={`This action will redirect you to a page for reject or declined respondents.`}
                        btnContinue={() => navigate(ROUTES.ALUMNI_REJECTS)}
                    />
                </div>
            </div>
        </div>
    )
}