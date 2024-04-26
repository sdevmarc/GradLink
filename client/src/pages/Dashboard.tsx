import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function Dashboard() {
    const [isSidebar, setSidebar] = useState<boolean>(false)

    const toggleSidebar = (value: boolean): void => {
        if (value) {
            setSidebar(true)
        } else {
            setSidebar(false)
        }
    }

    return (
        <>
            <div className="flex flex-col">
                <Navbar onSelectSidebar={(item) => toggleSidebar(item)} />
                <div className="flex">
                    <Sidebar SidebarStatus={isSidebar} />
                    <div className={`${isSidebar ? 'w-[100%]' : 'w-[82.5%]'} h-[93vh] p-[1rem] flex flex-col`}>
                        <h1
                            className='font-[600]'
                        >
                            DASHBOARD
                        </h1>
                    </div>
                </div>
            </div>
        </>
    )
}
