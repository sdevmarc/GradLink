import HeadSection, { SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { SidebarNavs, Sidebar } from '@/components/sidebar'
import { useQuery } from '@tanstack/react-query'
import { DataTableActiveCurriculum } from './program-data-table-components/curriculum/curriculum/active/data-table-active-curriculum'
import { ActiveCurriculumColumns } from './program-data-table-components/curriculum/curriculum/active/columns-active-curriculum'
import { ROUTES } from '@/constants'
import { API_CURRICULUM_FINDALL_ACTIVE, API_CURRICULUM_FINDALL_LEGACY } from '@/api/curriculum'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { DataTableLegacyCurriculum } from './program-data-table-components/curriculum/curriculum/legacy/data-table-legacy-curriculum'
import { LegacyCurriculumColumns } from './program-data-table-components/curriculum/curriculum/legacy/columns-legacy-curriculum'

export default function Curriculum() {
    const { data: activecurriculum, isLoading: activecurriculumLoading, isFetched: activecurriculumFetched } = useQuery({
        queryFn: () => API_CURRICULUM_FINDALL_ACTIVE(),
        queryKey: ['activecurriculums']
    })

    const { data: legacycurriculum, isLoading: legacycurriculumLoading, isFetched: legacycurriculumFetched } = useQuery({
        queryFn: () => API_CURRICULUM_FINDALL_LEGACY(),
        queryKey: ['legacycurriculums']
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
                            <Tabs defaultValue="active" className=''>
                                <div className="w-full flex items-center justify-end">
                                    <TabsList className="grid grid-cols-2">
                                        <TabsTrigger value="active">Active</TabsTrigger>
                                        <TabsTrigger value="legacy">Legacy</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="active">
                                    {activecurriculumLoading && <div>Loading...</div>}
                                    {activecurriculumFetched && <DataTableActiveCurriculum columns={ActiveCurriculumColumns} data={activecurriculum.data || []} />}
                                </TabsContent>
                                <TabsContent value="legacy">
                                    {legacycurriculumLoading && <div>Loading...</div>}
                                    {legacycurriculumFetched && <DataTableLegacyCurriculum columns={LegacyCurriculumColumns} data={legacycurriculum.data || []} />}
                                </TabsContent>
                            </Tabs>
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}