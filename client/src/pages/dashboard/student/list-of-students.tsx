import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { useQuery } from "@tanstack/react-query"
import { API_STUDENT_FINDALL } from "@/api/student"
import { StudentListOfStudentsColumns } from "./student-data-table-components/list-of-students/columns-student-list-of-students"
import { DataTableStudentListOfStudent } from "./student-data-table-components/list-of-students/data-table-list-of-students"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTableStudentAlumni } from "./student-data-table-components/alumni/data-table-alumni"
import { StudentAlumniColumns } from "./student-data-table-components/alumni/columns-student-alumni"
import { API_STUDENT_FINDALL_ALUMNI } from "@/api/alumni"

export default function ListOfStudents() {
    const { data: students, isLoading: studentLoading, isFetched: studentFetched } = useQuery({
        queryFn: () => API_STUDENT_FINDALL(),
        queryKey: ['students']
    })

    const { data: dataAlumni, isLoading: alumniLoading, isFetched: alumniFetched } = useQuery({
        queryFn: () => API_STUDENT_FINDALL_ALUMNI(),
        queryKey: ['students']
    })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="STUDENTS"
                                description="View and manage students."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex flex-col px-8">
                        <Tabs defaultValue="students" className="w-full">
                            <TabsList className="bg-background">
                                <TabsTrigger value="students">Students</TabsTrigger>
                                <TabsTrigger value="alumni">Alumni</TabsTrigger>
                            </TabsList>
                            <TabsContent value="students">
                                {studentLoading && <div>Loading...</div>}
                                {
                                    (!studentLoading && studentFetched) &&
                                    <DataTableStudentListOfStudent
                                        columns={StudentListOfStudentsColumns}
                                        data={students?.data || []}
                                    />
                                }
                            </TabsContent>
                            <TabsContent value="alumni">
                                {alumniLoading && <div>Loading...</div>}
                                {
                                    (!alumniLoading && alumniFetched) &&
                                    <DataTableStudentAlumni
                                        columns={StudentAlumniColumns}
                                        data={[]}
                                    />
                                }
                            </TabsContent>
                        </Tabs>

                    </main>
                </div>
            </div>
        </>
    )
}