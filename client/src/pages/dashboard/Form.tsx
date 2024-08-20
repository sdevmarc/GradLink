import FormTable from '@/components/form-table/form-table'
import Header_Dashboard from '@/components/header/Header_Dashboard'
import HeadSection from '@/components/HeadSection'
import MainTable from '@/components/MainTable'
import { Sidebar, SidebarNavs } from '@/components/Sidebar'

export default function Form() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <Header_Dashboard />
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[3.2rem]">
                        <HeadSection
                            title="FORMS"
                            description="A centralized list showcasing all created Google Forms for easy access and management."
                        />
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="List" link="/form" />
                            <SidebarNavs title="Trash" link="/" />
                        </Sidebar>
                        <MainTable>
                            <FormTable />
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}
