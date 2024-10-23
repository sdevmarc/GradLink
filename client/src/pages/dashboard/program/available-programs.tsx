import HeadSection, { SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { SidebarNavs, Sidebar } from '@/components/sidebar'
import { useQuery } from '@tanstack/react-query'
import { API_PROGRAM_FINDALL } from '@/api/program'
import { AvailableProgramsColumns } from './program-data-table-components/program/available-programs/columns-available-programs'
import { DataTableAvailablePrograms } from './program-data-table-components/program/available-programs/data-table-available-programs'
import { ROUTES } from '@/constants'

export default function Program() {
    const { data: program, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['programs']
    })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="AVAILABLE PROGRAMS"
                                description="Here's a list of avalailable programs."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs bg='bg-muted' title="Programs" link={ROUTES.AVAILABLE_PROGRAMS} />
                            <SidebarNavs title="Courses" link={ROUTES.AVAILABLE_COURSES} />
                            <SidebarNavs title="Curriculums" link={ROUTES.CURRICULUM} />
                        </Sidebar>
                        <MainTable>
                            {programLoading && <div>Loading...</div>}
                            {programFetched && <DataTableAvailablePrograms columns={AvailableProgramsColumns} data={program.data || []} />}
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}