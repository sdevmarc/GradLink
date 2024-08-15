import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { IAvatar } from "@/interface/Avatar.type"


export const UserAvatar = ({ image, initials }: IAvatar) => {
    return (
        <Popover>
            <PopoverTrigger>
                <Avatar>
                    <AvatarImage src={image} />
                    <AvatarFallback>
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </PopoverTrigger>
            <PopoverContent>
                Content here.
            </PopoverContent>
        </Popover>

    )
}