import MainTable from "@/components/main-table"
import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { useQuery } from "@tanstack/react-query"
import { API_STUDENT_FINDALL_ENROLLEES } from "@/api/student"
import { ROUTES } from "@/constants"
import { DataTableStudentStudentEnrollees } from "./enrollment-data-table-components/student-enrollees/data-table-student-enrollees"
import { StudentEnrolleesColumns } from "./enrollment-data-table-components/student-enrollees/columns-student-enrollees"

export default function StudentEnrollees() {
    const { data: students, isLoading: studentLoading, isFetched: studentFetched } = useQuery({
        queryFn: () => API_STUDENT_FINDALL_ENROLLEES(),
        queryKey: ['student-enrollees']
    })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="LIST OF ENROLLEES"
                                description="Here's a list of student informations."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Courses Offered" link={ROUTES.ENROLLMENT} />
                            <SidebarNavs bg='bg-muted' title="Enrollees" link={ROUTES.STUDENT_ENROLLEE} />
                            <SidebarNavs title="Current Enrolled" link={ROUTES.CURRENTLY_ENROLLED} />
                        </Sidebar>
                        <MainTable>
                            {studentLoading && <div>Loading...</div>}
                            {
                                (!studentLoading && studentFetched) &&
                                <DataTableStudentStudentEnrollees
                                    columns={StudentEnrolleesColumns}
                                    data={students?.data || []}
                                />
                            }
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}