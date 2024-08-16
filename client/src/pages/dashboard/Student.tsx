import Header_Dashboard from "@/components/header/Header_Dashboard";
import HeadSection from "@/components/HeadSection";
import { Sidebar, SidebarNavs } from "@/components/Sidebar";
import Table from "@/components/Table";

export default function Student() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <Header_Dashboard />
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-20">
                        <HeadSection
                            title="RECORD OF ENROLLED STUDENTS"
                            description="Here's a list of enrolled students."
                        />
                    </aside>
                    <main className="w-full h-[calc(100dvh-21.1dvh)] flex">
                        <Sidebar>
                            <SidebarNavs title="Table" link="/student" />
                            <SidebarNavs title="Trash" link="/" />
                        </Sidebar>
                        <Table />
                    </main>
                </div>
            </div>
        </>
    )
}
