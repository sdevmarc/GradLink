import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface LeftModalProps {
    isOpen: boolean
    onOpenChange: (e: boolean) => void
    title: string
    description: string
    content: React.ReactNode
    className?: string
}

export function LeftSheetModal({ isOpen, onOpenChange, title, description, content, className }: LeftModalProps) {
    const [open, setOpen] = useState<boolean>(isOpen)

    useEffect(() => {
        setOpen(isOpen)
    }, [isOpen])

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        onOpenChange(newOpen)
    }

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className={cn("sm:max-w-none", className)} side={`left`}>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>
                        {description}
                    </SheetDescription>
                </SheetHeader>
                {content}
            </SheetContent>
        </Sheet>
    )
}
