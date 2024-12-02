import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { DataTableCoursesOfferedInEnrollment } from "./enrollment-data-table-components/courses-offered/data-table-courses-offered-in-enrollment"
import { CoursesOfferedInEnrollmentColumns } from "./enrollment-data-table-components/courses-offered/columns-courses-offered-in-enrollment"
import { useQuery } from "@tanstack/react-query"
import { API_FINDALL_COURSES_OFFERED } from "@/api/offered"
import MainTable from "@/components/main-table"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { ROUTES } from "@/constants"
import { AuthContext } from "@/hooks/AuthContext"
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_USER_CHECK_DEFAULT_PASSWORD } from "@/api/user"

export default function Enrollment() {
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
        queryKey: ['check-password']
    })

    useEffect(() => {
        if (checkpasswordFetched) {
            if (!checkpassword.success) {
               navigate('/overview')
            } 
        }
    }, [checkpassword])

    const { data: courses, isLoading: coursesLoading, isFetched: coursesFetched } = useQuery({
        queryFn: () => API_FINDALL_COURSES_OFFERED(),
        queryKey: ['courses-offered']
    })

    const getSemesterText = (semester?: number) => {
        const semesters = {
            1: 'First',
            2: 'Second',
            3: 'Third'
        }
        return semester ? `for the ${semesters[semester as keyof typeof semesters]} Semester.` : ''
    }

    return (
        <div className="flex flex-col min-h-screen items-center">
            <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                <aside className="px-4 pb-4 pt-[8rem]">
                    <HeadSection>
                        <SubHeadSectionDetails
                            title={`Offered Courses ${getSemesterText(courses?.data[0]?.semesters)}`}
                            description={`Here's a list of offered courses.`}
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
                                <DataTableCoursesOfferedInEnrollment
                                    columns={CoursesOfferedInEnrollmentColumns}
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