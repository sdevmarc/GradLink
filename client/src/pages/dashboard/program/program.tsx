import { DataTable } from '@/components/data-table-components/data-table'
import HeadSection, { SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { SidebarNavs, Sidebar } from '@/components/sidebar'
import { ProgramColumns } from '@/components/data-table-components/columns/program-columns'
import { useQuery } from '@tanstack/react-query'
import { API_PROGRAM_FINDALL } from '@/api/program'

export default function Program() {
    const { data: program, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['program']
    })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="RECORD OF REGISTERED PROGRAMS"
                                description="Here's a list of registered programs."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs bg='bg-muted' title="Registered Programs" link="/program" />
                            <SidebarNavs title="Registered Courses" link="/program/courses" />
                        </Sidebar>
                        <MainTable>
                            {programLoading && <div>Loading...</div>}
                            {programFetched && <DataTable columns={ProgramColumns} data={program.data || []} toolbar='program' />}
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}