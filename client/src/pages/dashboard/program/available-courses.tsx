import { DataTable } from '@/components/data-table-components/data-table'
import HeadSection, { SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { SidebarNavs, Sidebar } from '@/components/sidebar'
import { useQuery } from '@tanstack/react-query'
import { CourseColumns } from '@/components/data-table-components/columns/course-columns'
import { API_COURSE_FINDALL } from '@/api/courses'
import { ROUTES } from '@/constants'

export default function Courses() {
    const { data: course, isLoading: courseLoading, isFetched: courseFetched } = useQuery({
        queryFn: () => API_COURSE_FINDALL(),
        queryKey: ['course']
    })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="REGISTERED COURSES"
                                description="Here's a list of registered courses."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Programs" link={ROUTES.AVAILABLE_PROGRAMS}/>
                            <SidebarNavs bg='bg-muted' title="Courses" link={ROUTES.AVAILABLE_COURSES} />
                        </Sidebar>
                        <MainTable>
                            {courseLoading && <div>Loading...</div>}
                            {courseFetched && <DataTable columns={CourseColumns} data={course.data || []} toolbar='course' />}
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}