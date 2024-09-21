import HeadSection, { SubHeadSectionDetails } from '@/components/head-section';
import { SidebarNavs, Sidebar } from '@/components/sidebar'
import MainTable from '@/components/main-table';
import { ROUTES } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { API_STUDENT_FINDALL_ALUMNI } from '@/api/alumni';
import { DataTableStudentAlumni } from './student-data-table-components/alumni/data-table-alumni';
import { StudentAlumniColumns } from './student-data-table-components/alumni/columns-student-alumni';

export default function Alumni() {
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
                                title="RECORD OF ALUMNI GRADUATES"
                                description="Here's a list of registered alumni's."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Currently Enrolled" link={ROUTES.CURRENTLY_ENROLLED} />
                            <SidebarNavs title="List of Students" link={ROUTES.LIST_OF_STUDENTS} />
                            <SidebarNavs bg='bg-muted' title="Alumni Graduates" link={ROUTES.ALUMNI_GRADUATES} />
                        </Sidebar>
                        <MainTable>
                            {alumniLoading && <div>Loading...</div>}
                            {alumniFetched && <DataTableStudentAlumni columns={StudentAlumniColumns} data={dataAlumni.data || []} />}
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}