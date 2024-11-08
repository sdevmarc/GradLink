import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { useQuery } from "@tanstack/react-query"
import { API_FINDALL_COURSES_OFFERED } from "@/api/offered"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { ROUTES } from "@/constants"
import MainTable from "@/components/main-table"
import { DataTableArchivedOfferedCourses } from "./enrollment-data-table-components/archived-offered-courses/data-table-archived-offered-courses."
import { ArchivedOfferedCoursestColumns } from "./enrollment-data-table-components/archived-offered-courses/columns-archived-offered-courses"

export default function ArchivedOfferedCourses() {
    const { data: courses, isLoading: coursesLoading, isFetched: coursesFetched } = useQuery({
        queryFn: () => API_FINDALL_COURSES_OFFERED(),
        queryKey: ['courses-offered']
    })

    return (
        <div className="flex flex-col min-h-screen items-center">
            <div className="w-full max-w-[90rem] flex flex-col">
                <aside className="px-4 pb-4 pt-[8rem]">
                    <HeadSection>
                        <SubHeadSectionDetails
                            title="Archived Offered Courses"
                            description={`Here is a list of the past offered courses.`}
                        />
                    </HeadSection>
                </aside>
                <main className="flex">
                    <Sidebar>
                        <SidebarNavs title="Offered Courses" link={ROUTES.ENROLLMENT} />
                        <SidebarNavs bg='bg-muted' title="Archived Offered Courses" link={ROUTES.ENROLLMENT_ARCHIVED_OFFERED_COURSES} />
                        <SidebarNavs title="Attrition Rate of Courses" link={ROUTES.ENROLLMENT_ATTRITION_RATE_COURSES} />
                        <SidebarNavs title="Attrition Rate of Programs" link={ROUTES.ENROLLMENT_ATTRITION_RATE_PROGRAMS} />
                    </Sidebar>
                    <MainTable>
                        {coursesLoading && <div>Loading...</div>}
                        {
                            (!coursesLoading && coursesFetched) &&
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col">
                                    <h1 className="text-xl font-semibold">Academic Year: <span>{courses?.data[0]?.academicYears.startDate} - {courses?.data[0]?.academicYears?.endDate}</span></h1>
                                    <h1 className="text-md font-medium">
                                        {courses?.data[0]?.semesters === 1 && 'First Semester'}
                                        {courses?.data[0]?.semesters === 2 && 'Second Semester'}
                                        {courses?.data[0]?.semesters === 3 && 'MidYear'}
                                    </h1>
                                </div>
                                <DataTableArchivedOfferedCourses
                                    columns={ArchivedOfferedCoursestColumns}
                                    data={courses?.data || []}
                                />
                            </div>
                        }
                    </MainTable>
                </main>
            </div>
        </div>
    )
}