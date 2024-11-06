import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface SheetModalProps {
    isOpen: boolean
    onOpenChange: (e: boolean) => void
    title: string
    description: string
    content: React.ReactNode
    className?: string
    side?: 'top' | 'bottom' | 'left' | 'right'
}

export function SheetModal({ isOpen, onOpenChange, title, description, content, className, side = 'right' }: SheetModalProps) {
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
            <SheetContent className={cn("sm:max-w-none", className)} side={side}>
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
