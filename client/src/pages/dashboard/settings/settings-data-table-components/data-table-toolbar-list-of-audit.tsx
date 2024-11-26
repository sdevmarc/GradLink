"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/data-table-components/data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbarAudit<TData>({
    table
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    // const [formattedprogram, setFormattedProgram] = useState<ProgramOption[]>([]);
    // const [filteredPrograms, setFilteredPrograms] = useState<ProgramOption[]>([]);
    // const [filteredPrograms, setFilteredPrograms] = useState<ProgramOption[]>([]);
    // const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
    // const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    //     from: new Date(new Date().getFullYear(), 0, 1),
    //     to: new Date()
    // }); //This is a no no

    const filter_options = [
        { value: 'user_login', label: 'User Login' },
        { value: 'settings_changed', label: 'Settings Changed' },
        { value: 'user_created', label: 'User Created' },
        { value: 'password_changed', label: 'Password Changed' },
        { value: 'program_changed', label: 'Program Changed' },
        { value: 'course_changed', label: 'Course Changed' },
        { value: 'curriculum_changed', label: 'Curriculum Changed' },
        { value: 'semester_changed', label: 'Semester Changed' },
        { value: 'student_changed', label: 'Student Changed' },
    ]

    return (
        <div className="flex flex-wrap items-center justify-between">
            <div className="w-full flex items-center justify-between gap-4">
                <Input
                    placeholder="Search logs..."
                    value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("description")?.setFilterValue(event.target.value);
                    }}
                    className="h-8 w-full"
                />

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
                    {table.getColumn("action") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("action")}
                            title="Filter by action"
                            options={filter_options}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}