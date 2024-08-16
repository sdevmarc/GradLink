import { ISidebar, ISidebarNavs } from '@/interface/FunctionComponents.type'
import { NavLink } from 'react-router-dom'
import './index.css'

export const Sidebar = ({ children }: ISidebar) => {
    return (
        <>
            <div className="w-[20%] h-full flex flex-col p-4 gap-2">
                {children}
            </div>
        </>
    )
}

export const SidebarNavs = ({ title, link }: ISidebarNavs) => {
    return (
        <NavLink to={link} className="sidebarnavs w-full text-text font-medium text-sm px-4 py-[.7rem] hover:bg-muted-foreground rounded-lg">
            {title}
        </NavLink>
    )
}