"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface ILists {
    value: string
    label: string
}

interface IComboBox {
    lists: ILists[]
    placeholder: string
    value: string
    setValue: (e: string) => void
}

export function Combobox({ lists, placeholder, value, setValue }: IComboBox) {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")

    const filteredItems = React.useMemo(() => {
        if (!searchQuery) return lists

        return lists.filter(item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [lists, searchQuery])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-8 px-2 lg:px-3 justify-between capitalize"
                >
                    {value
                        ? lists.find((item) => item.value === value)?.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder={placeholder} />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {filteredItems.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.label}
                                    onSelect={(currentLabel) => {
                                        const selectedItem = lists.find(i => i.label.toLowerCase() === currentLabel.toLowerCase());
                                        setValue(value === selectedItem?.value ? "" : (selectedItem?.value || ""));
                                        setOpen(false);
                                        setSearchQuery("");
                                    }}
                                    className="capitalize"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
