import { API_USER_LOGOUT } from "@/api/user";
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
import { AuthContext } from "@/hooks/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { ChevronDown } from 'lucide-react';
import { useContext } from "react";

import { useNavigate } from "react-router-dom"
import Loading from "./loading";

export const UserAvatar = () => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate()

    const { mutateAsync: userlogout, isPending: userlogoutPending } = useMutation({
        mutationFn: API_USER_LOGOUT,
        onSuccess: async (data) => {
            if (!data.success) {
                setIsAuthenticated(false)
                return
            } else {
                setIsAuthenticated(true)
                navigate(ROUTES.HOME)
                return
            }
        },
        onError: (data) => {
            setIsAuthenticated(false)
            console.error(data)
        }
    })

    const handleAccountSettings = () => {
        navigate(ROUTES.GENERAL_SETTINGS)
    }

    const handleLogout = async () => {
        await userlogout()
    }

    return (
        <>
            {userlogoutPending && <Loading />}
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
        </>
    )
}