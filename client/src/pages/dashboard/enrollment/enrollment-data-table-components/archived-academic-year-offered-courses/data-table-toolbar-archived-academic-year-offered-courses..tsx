"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DataTableFacetedFilter } from "@/components/data-table-components/data-table-faceted-filter"
import { API_FINDALL_ACADEMIC_YEARS_IN_OFFERED_COURSES } from "@/api/offered"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbarArchivedAcademicYearOfferedCourses<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const [filteredAcademicYear, setFilteredAcademicYear] = useState<{ label: string, value: string }[]>([])

    const { data: academicyears, isLoading: academicyearsLoading, isFetched: academicyearsFetched } = useQuery({
        queryFn: () => API_FINDALL_ACADEMIC_YEARS_IN_OFFERED_COURSES(),
        queryKey: ['courses-offered']
    })

    useEffect(() => {
        if (!academicyearsLoading && academicyearsFetched) {
            const years = academicyears?.data?.map((item: { offeredId: string, academicYear: string }) => {
                return { label: item.academicYear, value: item.academicYear }
            });
            setFilteredAcademicYear(years);
        }
    }, [academicyearsFetched, academicyearsLoading, academicyears]);
    
    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                {table.getColumn("_id") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("_id")}
                        title="Academic Year"
                        options={filteredAcademicYear || []}
                    />
                )}
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
            </div>
        </div>
    )
}