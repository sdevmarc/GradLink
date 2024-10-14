"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActionsAvailableCourses<TData>({ row }: DataTableRowActionsProps<TData>) {
    const navigate = useNavigate()

    const handleViewDetails = () => {
        // console.log(row.original)
        const { _id: id } = row.original as { _id: string }
        const encoded_id = btoa(id)
        navigate(`/student/details/${encoded_id}`)
    }

    const handleEvaluate = () => {
        // console.log(row.original)
        const { _id: id } = row.original as { _id: string }
        const encoded_id = btoa(id)
        navigate(`/student/evaluation/${encoded_id}`)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <DotsHorizontalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={handleViewDetails}>View details</DropdownMenuItem>
                <DropdownMenuItem>Update Enrollment</DropdownMenuItem>
                <DropdownMenuItem onClick={handleEvaluate}>Evaluate</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}