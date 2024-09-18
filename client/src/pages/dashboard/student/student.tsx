import MainTable from "@/components/main-table"
import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { DataTable } from "@/components/data-table-components/data-table"
import { StudentColumns } from "@/components/data-table-components/columns/student-columns"
import { useQuery } from "@tanstack/react-query"
import { API_STUDENT_FINDALL } from "@/api/student"

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
                                title="RECORD OF REGISTERED STUDENTS"
                                description="Here's a list of enrolled students."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs bg='bg-muted' title="Registered Students" link="/student" />
                            <SidebarNavs title="Alumni Graduates" link="/student/alumni" />
                        </Sidebar>
                        <MainTable>
                            {studentFetched && <DataTable toolbar="student" columns={StudentColumns} data={students.data || []} />}
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}