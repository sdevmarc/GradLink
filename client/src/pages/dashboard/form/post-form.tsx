import Header_Dashboard from '@/components/header-dashboard'
import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'

export default function PostForm() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <Header_Dashboard />
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[5rem]">
                        <HeadSection>
                            <BackHeadSection />
                            <SubHeadSectionDetails
                                title="CREATE A GOOGLE FORM"
                                description="A feature for building and customizing Google Forms to gather and organize information efficiently."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="List" link="/form" />
                            <SidebarNavs title="Trash" link="/" />
                        </Sidebar>
                        {/* <MainTable>
                            <FormTable />
                        </MainTable> */}
                    </main>
                </div>
            </div>
        </>
    )
}
