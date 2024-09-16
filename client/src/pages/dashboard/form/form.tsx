import Header_Dashboard from '@/components/header-dashboard'
import HeadSection, { SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { DataTable } from '@/components/data-table-components/data-table'
import { ProgramColumns } from '@/components/data-table-components/columns/program-columns'

export default function Form() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <Header_Dashboard />
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[5rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="FORMS"
                                description="A centralized list showcasing all created Google Forms for easy access and management."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Mail" link="/form" />
                            <SidebarNavs title="Pending Forms" link="/form" />
                            <SidebarNavs title="Trash" link="/" />
                        </Sidebar>
                        <MainTable>
                            <DataTable columns={ProgramColumns} data={program.data || []} toolbar='student' />
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}
