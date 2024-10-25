import MainTable from "@/components/main-table"
import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { useQuery } from "@tanstack/react-query"
import { API_STUDENT_FINDALL_ENROLLED } from "@/api/student"
import { ROUTES } from "@/constants"
import { useState } from "react"
import { DataTableStudentCurrentEnrolled } from "./enrollment-data-table-components/current-enrolled/data-table-current-enrolled"
import { StudentCurrentEnrolledColumns } from "./enrollment-data-table-components/current-enrolled/columns-current-enrolled"
import { IAPIStudents } from "@/interface/student.interface"

export default function CurrentEnrolledStudent() {
    const [resetSelection, setResetSelection] = useState(false)

    const { data: students, isLoading: studentLoading, isFetched: studentFetched } = useQuery({
        queryFn: () => API_STUDENT_FINDALL_ENROLLED(),
        queryKey: ['students']
    })

    const handleStudentChange = (selectedStudent: IAPIStudents[]) => {
        console.log(selectedStudent)
    }

    const isLoading = studentLoading

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
                            <SidebarNavs title="Courses Offered" link={ROUTES.ENROLLMENT} />
                            <SidebarNavs bg='bg-muted' title="Current Enrolled" link={ROUTES.CURRENTLY_ENROLLED} />
                        </Sidebar>
                        <MainTable>
                            {isLoading && <div>Loading...</div>}
                            {(!isLoading && studentFetched) &&
                                <DataTableStudentCurrentEnrolled
                                    columns={StudentCurrentEnrolledColumns}
                                    data={students.data || []}
                                    fetchCheck={handleStudentChange}
                                    resetSelection={resetSelection}
                                    onResetComplete={() => setResetSelection(false)}
                                />}
                        </MainTable>
                    </main>
                </div>
            </div>

        </>
    )
}