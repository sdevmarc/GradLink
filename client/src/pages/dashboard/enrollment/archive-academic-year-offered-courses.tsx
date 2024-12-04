import HeadSection, { BackHeadSection, SubHeadSectionDetails } from "@/components/head-section"
import { useQuery } from "@tanstack/react-query"
import { API_FINDALL_ACADEMIC_YEARS_IN_OFFERED_COURSES } from "@/api/offered"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { ROUTES } from "@/constants"
import MainTable from "@/components/main-table"
import { DataTableArchivedAcademicYearOfferedCourses } from "./enrollment-data-table-components/archived-academic-year-offered-courses/data-table-archived-academic-year-offered-courses."
import { ArchivedAcademicYearOfferedCoursesColumns } from "./enrollment-data-table-components/archived-academic-year-offered-courses/columns-archived-academic-year-offered-courses"
import { useNavigate } from "react-router-dom"
import { useContext, useEffect } from "react"
import { AuthContext } from "@/hooks/AuthContext"
import { API_USER_CHECK_DEFAULT_PASSWORD } from "@/api/user"

export default function ArchivedAcademicYearOfferedCourses() {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            // Redirect to login page if not authenticated
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate])

    const { data: checkpassword, isFetched: checkpasswordFetched } = useQuery({
        queryFn: () => API_USER_CHECK_DEFAULT_PASSWORD(),
        queryKey: ['checkpassword']
    })

    useEffect(() => {
        if (checkpasswordFetched) {
            if (!checkpassword.success) {
               navigate('/overview')
            } 
        }
    }, [checkpassword])

    const { data: courses, isLoading: coursesLoading, isFetched: coursesFetched } = useQuery({
        queryFn: () => API_FINDALL_ACADEMIC_YEARS_IN_OFFERED_COURSES(),
        queryKey: ['courses-offered']
    })

    return (
        <div className="flex flex-col min-h-screen items-center">
            <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                <aside className="px-4 pb-4 pt-[8rem]">
                    <HeadSection>
                        <BackHeadSection />
                        <SubHeadSectionDetails
                            title="Archived Academic Years of Offered Courses"
                            description={`Here is a list of the past offered courses.`}
                        />
                    </HeadSection>
                </aside>
                <main className="flex">
                    <Sidebar>
                        <SidebarNavs bg='bg-muted' title="Offered Courses" link={ROUTES.ENROLLMENT} />
                        <SidebarNavs title="Attrition Rate of Courses" link={ROUTES.ENROLLMENT_ATTRITION_RATE_COURSES} />
                        <SidebarNavs title="Attrition Rate of Programs" link={ROUTES.ENROLLMENT_ATTRITION_RATE_PROGRAMS} />
                    </Sidebar>
                    <MainTable>
                        {coursesLoading && <div>Loading...</div>}
                        {
                            (!coursesLoading && coursesFetched) &&
                            <div className="flex flex-col gap-4">
                                <DataTableArchivedAcademicYearOfferedCourses
                                    columns={ArchivedAcademicYearOfferedCoursesColumns}
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