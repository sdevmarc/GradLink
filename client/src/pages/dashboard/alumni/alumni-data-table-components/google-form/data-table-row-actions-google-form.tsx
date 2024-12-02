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
import { useState } from "react";
import { SheetModal } from "@/components/sheet-modal";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActionsAlumniGoogleForm<TData>({ row }: DataTableRowActionsProps<TData>) {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleViewDetails = () => {
        setIsOpen(true)
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
    }

    return (
        <>
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
                    <DropdownMenuItem onClick={handleViewDetails}>View Details</DropdownMenuItem>
                    <DropdownMenuItem>View Enrollees</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SheetModal
                className="w-[60%]"
                isOpen={isOpen}
                onOpenChange={handleOpenChange}
                title="Graduate Student Details"
                description="View details of the selected alumni student."
                content={''}
            />
        </>

    );
}