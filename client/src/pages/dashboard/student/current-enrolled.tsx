import MainTable from "@/components/main-table"
import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { DataTable } from "@/components/data-table-components/data-table"
import { useQuery } from "@tanstack/react-query"
import { API_STUDENT_FINDALL_ENROLLED } from "@/api/student"
import { ROUTES } from "@/constants"
import { StudentCourseColumns } from "./student-data-table-components/student/columns"

export default function CurrentEnrolledStudent() {
    const { data: students, isLoading: studentLoading, isFetched: studentFetched } = useQuery({
        queryFn: () => API_STUDENT_FINDALL_ENROLLED(),
        queryKey: ['enrolled_students']
    })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="CURRENTLY ENROLLED STUDENTS"
                                description="Here's a list of currently enrolled students this semester."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs bg='bg-muted' title="Currently Enrolled" link={ROUTES.CURRENTLY_ENROLLED} />
                            <SidebarNavs title="List of Students" link={ROUTES.LIST_OF_STUDENTS} />
                            <SidebarNavs title="Alumni Graduates" link={ROUTES.ALUMNI_GRADUATES} />
                        </Sidebar>
                        <MainTable>
                            {studentFetched && <DataTable toolbar="current_student" columns={StudentCourseColumns} data={students.data || []} />}
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}