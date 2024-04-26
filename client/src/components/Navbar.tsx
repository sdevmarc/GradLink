import MenuIcon from '@mui/icons-material/Menu'
import HeaderImg from '../assets/smu_header.png'
import Badge from '@mui/material/Badge'
import MailIcon from '@mui/icons-material/Mail'
import Avatar from '@mui/material/Avatar'
import { useState } from 'react'

interface NavbarProps {
    onSelectSidebar: (value: boolean) => void;
}

export default function Navbar({ onSelectSidebar }: NavbarProps) {
    const [isSidebar, setSidebar] = useState<boolean>(true)

    const SidebarHandler = () => {
        setSidebar(prev => !prev)
        onSelectSidebar(isSidebar)
    }

    return (
        <>
            <div className="w-full h-[7vh] bg-white border border-solid px-[1rem] flex justify-between items-center">
                <div className="h-full flex items-center">
                    <button
                        onClick={SidebarHandler}
                    >
                        <MenuIcon sx={{ color: '#111111' }} />
                    </button>
                    <div className="overflow-hidden h-full">
                        <img
                            className='h-full object-contain'
                            src={HeaderImg}
                            alt="smu header"
                        />
                    </div>
                </div>

                <div className='h-full flex items-center gap-[2rem]'>
                    <button>
                        <Badge badgeContent={4} color="primary">
                            <MailIcon color="action" />
                        </Badge>
                    </button>

                    <button>
                        <Avatar {...stringAvatar('Marc Edison')} />
                    </button>

                </div>
            </div>
        </>
    )
}


function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}