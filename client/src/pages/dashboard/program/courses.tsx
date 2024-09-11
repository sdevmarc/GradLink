import { DataTable } from '@/components/data-table-components/data-table'
import Header_Dashboard from '@/components/header-dashboard'
import HeadSection, { SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { SidebarNavs, Sidebar } from '@/components/sidebar'
import { useQuery } from '@tanstack/react-query'
import { CourseColumns } from '@/components/data-table-components/columns/course-columns'
import { API_COURSE_FINDALL } from '@/api/courses'

export default function Courses() {
    const { data: course, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_COURSE_FINDALL(),
        queryKey: ['course']
    })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <Header_Dashboard />
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[5rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="RECORD OF REGISTERED COURSES"
                                description="Here's a list of registered courses."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Programs" link="/program" />
                            <SidebarNavs bg='bg-muted' title="Courses" link="/program/courses" />
                            <SidebarNavs title="Trash" link="/" />
                        </Sidebar>
                        <MainTable>
                            {programLoading && <div>Loading...</div>}
                            {programFetched && <DataTable columns={CourseColumns} data={course.data || []} toolbar='course' />}

                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}