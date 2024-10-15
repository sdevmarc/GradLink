import HeadSection, { SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { SidebarNavs, Sidebar } from '@/components/sidebar'
import { useQuery } from '@tanstack/react-query'
import { CourseColumns } from '@/components/data-table-components/columns/course-columns'
import { API_COURSE_FINDALL } from '@/api/courses'
import { ROUTES } from '@/constants'
import { DataTableAvailableCourses } from './program-data-table-components/courses/available-courses/data-table-available-courses'

export default function Courses() {
    const { data: course, isLoading: courseLoading, isFetched: courseFetched } = useQuery({
        queryFn: () => API_COURSE_FINDALL(),
        queryKey: ['courses']
    })

    if (courseFetched) { console.log(course.data) }

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
                            <SidebarNavs title="Programs" link={ROUTES.AVAILABLE_PROGRAMS} />
                            <SidebarNavs bg='bg-muted' title="Courses" link={ROUTES.AVAILABLE_COURSES} />
                            <SidebarNavs title="Curriculums" link={ROUTES.CURRICULUM} />
                        </Sidebar>
                        <MainTable>
                            {courseLoading && <div>Loading...</div>}
                            {courseFetched && <DataTableAvailableCourses columns={CourseColumns} data={course.data.courses || []} />}
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}