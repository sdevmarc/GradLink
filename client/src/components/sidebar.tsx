import { IFCChildren } from '@/interface/index'
import { NavLink } from 'react-router-dom'
import './index.css'

export const Sidebar = ({ children }: IFCChildren) => {
    return (
        <>
            <div className="w-[20%] h-full flex flex-col px-4 gap-2">
                {children}
            </div>
        </>
    )
}

export const SidebarNavs = ({ title, link, bg }: IFCChildren) => {
    return (
        <NavLink to={link || ''} className={`${bg} w-full text-text font-normal text-sm px-4 py-[.7rem] hover:bg-muted rounded-lg`}>
            {title}
        </NavLink>
    )
}