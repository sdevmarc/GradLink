import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

import { IAvatar } from "@/interface/index"
import { useNavigate } from "react-router-dom"

export const UserAvatar = ({ image, initials }: IAvatar) => {
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
                <Avatar>
                    <AvatarImage src={image} />
                    <AvatarFallback>
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[13rem]">
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