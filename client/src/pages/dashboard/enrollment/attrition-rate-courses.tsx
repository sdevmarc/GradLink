import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { useQuery } from "@tanstack/react-query"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { ROUTES } from "@/constants"
import MainTable from "@/components/main-table"
import { DataTableAttritionRateCourses } from "./enrollment-data-table-components/attrition-rate-courses/data-table-attrition-rate-courses."
import { AttritionRateCoursestColumns } from "./enrollment-data-table-components/attrition-rate-courses/columns-attrition-rate-courses"
import { API_COURSE_FINDALL } from "@/api/courses"
import { useContext, useEffect } from "react"
import { AuthContext } from "@/hooks/AuthContext"
import { useNavigate } from "react-router-dom"
import { API_USER_CHECK_DEFAULT_PASSWORD } from "@/api/user"

export default function AttritionRateCourses() {
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
        queryFn: () => API_COURSE_FINDALL(),
        queryKey: ['courses-offered']
    })

    return (
        <div className="flex flex-col min-h-screen items-center">
            <div className="w-full max-w-[90rem] flex flex-col">
                <aside className="px-4 pb-4 pt-[8rem]">
                    <HeadSection>
                        <SubHeadSectionDetails
                            title="Attrition Rate for Courses"
                            description={`View attrition rate for courses.`}
                        />
                    </HeadSection>
                </aside>
                <main className="flex">
                    <Sidebar>
                        <SidebarNavs title="Offered Courses" link={ROUTES.ENROLLMENT} />
                        <SidebarNavs bg='bg-muted' title="Attrition Rate of Courses" link={ROUTES.ENROLLMENT_ATTRITION_RATE_COURSES} />
                        <SidebarNavs title="Attrition Rate of Programs" link={ROUTES.ENROLLMENT_ATTRITION_RATE_PROGRAMS} />
                    </Sidebar>
                    <MainTable>
                        {coursesLoading && <div>Loading...</div>}
                        {
                            (!coursesLoading && coursesFetched) &&
                            <DataTableAttritionRateCourses
                                columns={AttritionRateCoursestColumns}
                                data={courses?.data || []}
                            />
                        }
                    </MainTable>
                </main>
            </div>
        </div>
    )
}