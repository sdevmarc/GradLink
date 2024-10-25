import MainTable from "@/components/main-table"
import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { useQuery } from "@tanstack/react-query"
import { API_STUDENT_FINDALL } from "@/api/student"
import { ROUTES } from "@/constants"
import { StudentListOfStudentsColumns } from "./student-data-table-components/list-of-students/columns-student-current-enrolled"
import { DataTableStudentListOfStudent } from "./student-data-table-components/list-of-students/data-table-list-of-students"

export default function Student() {
    const { data: students, isLoading: studentLoading, isFetched: studentFetched } = useQuery({
        queryFn: () => API_STUDENT_FINDALL(),
        queryKey: ['students']
    })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="LIST OF STUDENTS"
                                description="Here's a list of registered students."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs bg='bg-muted' title="List of Students" link={ROUTES.LIST_OF_STUDENTS} />
                            <SidebarNavs title="Alumni Graduates" link={ROUTES.ALUMNI_GRADUATES} />
                        </Sidebar>
                        <MainTable>
                            {studentLoading && <div>Loading...</div>}
                            {
                                (!studentLoading && studentFetched) &&
                                <DataTableStudentListOfStudent
                                    columns={StudentListOfStudentsColumns}
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