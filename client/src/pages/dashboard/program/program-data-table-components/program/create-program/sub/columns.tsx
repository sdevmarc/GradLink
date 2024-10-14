import {
    ColumnDef,
} from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { IAPICourse } from '@/interface/course.interface'

export const CreateProgramInCourseColumns: ColumnDef<IAPICourse>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "code",
        header: "Code.",
        cell: ({ row }) => (
            <div>{row.getValue("code")}</div>
        ),
    },
    {
        accessorKey: "descriptiveTitle",
        header: 'Descriptive Title',
        cell: ({ row }) => <div className="lowercase">{row.getValue("descriptiveTitle")}</div>,
    },
    {
        accessorKey: "residency",
        header: 'Residency',
        cell: ({ row }) => (
            <div>{row.getValue("residency")}</div>
        ),
    }
]