import HeadSection, { SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { ROUTES } from '@/constants'
import { DataTableStudentAlumni } from './data-table-form/data-table-form'
import { FormColumns } from './data-table-form/columns-student-form'

export default function Form() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="GOOGLE FORM"
                                description="Here's a list of responses from the alumni graduates."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs bg='bg-muted' title="Responses" link={ROUTES.GOOGLE_FORM} />
                            <SidebarNavs title="Trash" link="/" />
                        </Sidebar>
                        <MainTable>
                            <DataTableStudentAlumni columns={FormColumns} data={[]} />
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}
