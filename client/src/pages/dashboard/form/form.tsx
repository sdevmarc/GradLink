import HeadSection, { SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { DataTable } from '@/components/data-table-components/data-table'
import { ProgramColumns } from '@/components/data-table-components/columns/program-columns'
import { ROUTES } from '@/constants'

export default function Form() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
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
                            <SidebarNavs title="Mail" link={ROUTES.GOOGLE_FORM} />
                            <SidebarNavs title="Pending Forms" link={ROUTES.GOOGLE_FORM} />
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
