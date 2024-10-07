import HeadSection, { SubHeadSectionDetails } from '@/components/head-section';
import { SidebarNavs, Sidebar } from '@/components/sidebar'
import MainTable from '@/components/main-table';
import { ROUTES } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { DataTableStudentGraduatingStudent } from './student-data-table-components/graduating-student/data-table-graduating-student';
import { useState } from 'react';
import { StudentGraduatingStudentColumns } from './student-data-table-components/graduating-student/columns-student-graduating-student';
import { API_STUDENT_FINDALL_ENROLLED } from '@/api/student';

export default function GraduatingStudent() {
    const [resetSelection, setResetSelection] = useState(false)

    const { data: students, isLoading: studentLoading, isFetched: studentFetched } = useQuery({
        queryFn: () => API_STUDENT_FINDALL_ENROLLED(),
        queryKey: ['students']
    })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="GRADUATING STUDENTS"
                                description="Here's a list of registered and graduating students."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Currently Enrolled" link={ROUTES.CURRENTLY_ENROLLED} />
                            <SidebarNavs title="List of Students" link={ROUTES.LIST_OF_STUDENTS} />
                            <SidebarNavs bg='bg-muted' title="Graduating Students" link={ROUTES.GRADUATING_STUDENTS} />
                            <SidebarNavs title="Alumni Graduates" link={ROUTES.ALUMNI_GRADUATES} />
                        </Sidebar>
                        <MainTable>
                            {studentLoading && <div>Loading...</div>}
                            {studentFetched &&
                                <DataTableStudentGraduatingStudent
                                    columns={StudentGraduatingStudentColumns}
                                    data={students.data || []}
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