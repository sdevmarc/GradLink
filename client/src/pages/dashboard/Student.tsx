import MainTable from "@/components/MainTable"
import Header_Dashboard from "@/components/header/Header_Dashboard"
import HeadSection from "@/components/HeadSection"
import { Sidebar, SidebarNavs } from "@/components/Sidebar"

export default function Student() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <Header_Dashboard />
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[3.2rem]">
                        <HeadSection
                            title="RECORD OF ENROLLED STUDENTS"
                            description="Here's a list of enrolled students."
                        />
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Table" link="/student" />
                            <SidebarNavs title="Trash" link="/" />
                        </Sidebar>
                        <MainTable />
                    </main>
                </div>
            </div>
        </>
    )
}