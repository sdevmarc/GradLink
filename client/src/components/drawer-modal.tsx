"use client"

import * as React from "react"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"

interface DrawerModalProps {
    isOpen: boolean
    onOpenChange: (e: boolean) => void
    title: string
    description?: string
    content: React.ReactNode
}


export function DrawerModal({
    isOpen,
    onOpenChange,
    title,
    description,
    content
}: DrawerModalProps
) {
    const [open, setOpen] = React.useState<boolean>(isOpen)

    React.useEffect(() => {
        setOpen(isOpen)
    }, [isOpen])

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        onOpenChange(newOpen)
    }

    return (

        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-xl">
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerDescription>
                            {description}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-1 pb-0">
                        <div className=" h-[250px]">
                            {content}
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
