import HeadSection, { SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { SidebarNavs, Sidebar } from '@/components/sidebar'
import { useQuery } from '@tanstack/react-query'
import { DataTableCurriculum } from './program-data-table-components/curriculum/curriculum/data-table-curriculum'
import { CurriculumColumns } from './program-data-table-components/curriculum/curriculum/columns-curriculum'
import { ROUTES } from '@/constants'
import { API_CURRICULUM_FINDALL } from '@/api/curriculum'

export default function Curriculum() {
    const { data: curriculum, isLoading: curriculumLoading, isFetched: curriculumFetched } = useQuery({
        queryFn: () => API_CURRICULUM_FINDALL(),
        queryKey: ['curriculums']
    })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="CURRICULUM"
                                description="Here's a list of all registered curriculum."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Programs" link={ROUTES.AVAILABLE_PROGRAMS} />
                            <SidebarNavs title="Courses" link={ROUTES.AVAILABLE_COURSES} />
                            <SidebarNavs bg='bg-muted' title="Curriculums" link={ROUTES.CURRICULUM} />
                        </Sidebar>
                        <MainTable>
                            {curriculumLoading && <div>Loading...</div>}
                            {curriculumFetched && <DataTableCurriculum columns={CurriculumColumns} data={curriculum.data || []} />}
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}