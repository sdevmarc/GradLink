import FormTable from '@/components/form-table/form-table'
import Header_Dashboard from '@/components/header-dashboard'
import HeadSection, { SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { Sidebar, SidebarNavs } from '@/components/sidebar'

export default function Form() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <Header_Dashboard />
                <div className="w-full h-screen fixed top-0 bg-black/40 flex justify-center items-center">
                    <h1 className='text-white font-semibold text-[7rem]'>
                        IN RENOVATION
                    </h1>
                </div>
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
