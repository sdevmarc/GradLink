import { Avatar } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ROUTES } from "@/constants"
import { ChevronDown } from 'lucide-react';

import { useNavigate } from "react-router-dom"

export const UserAvatar = () => {
    const navigate = useNavigate()

    const handleAccountSettings = () => {
        navigate(ROUTES.GENERAL_SETTINGS)
    }

    const handleLogout = () => {
        navigate(ROUTES.HOME)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="flex items-center justify-center bg-muted hover:opacity-[.6]">
                    <ChevronDown className="text-primary" strokeWidth={3} size={20} />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[150px] bg-primary-foreground">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleAccountSettings}>
                        Account Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <a href="https://www.linkedin.com/in/sdevmarc/" target="_blank">
                        Contact Support
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                    Log out
                    {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}