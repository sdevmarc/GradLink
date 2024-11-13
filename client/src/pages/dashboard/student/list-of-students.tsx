import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { useQuery } from "@tanstack/react-query"
import { API_STUDENT_FINDALL } from "@/api/student"
import { StudentListOfStudentsColumns } from "./student-data-table-components/list-of-students/columns-student-list-of-students"
import { DataTableStudentListOfStudent } from "./student-data-table-components/list-of-students/data-table-list-of-students"

export default function ListOfStudents() {
    const { data: students, isLoading: studentLoading, isFetched: studentFetched } = useQuery({
        queryFn: () => API_STUDENT_FINDALL(),
        queryKey: ['students']
    })

    return (
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="Student Information"
                                description="View and manage students."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex px-8">
                        {studentLoading && <div>Loading...</div>}
                        {
                            (!studentLoading && studentFetched) &&
                            <DataTableStudentListOfStudent
                                columns={StudentListOfStudentsColumns}
                                data={students?.data || []}
                            />
                        }
                    </main>
                </div>
            </div>
    )
}