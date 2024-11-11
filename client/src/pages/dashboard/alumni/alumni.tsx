import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { useQuery } from "@tanstack/react-query"
import { API_STUDENT_FINDALL_ALUMNI } from "@/api/alumni"
import { DataTableStudentAlumni } from "./alumni-data-table-components/alumni/data-table-alumni"
import { StudentAlumniColumns } from "./alumni-data-table-components/alumni/columns-student-alumni"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import MainTable from "@/components/main-table"
import { ROUTES } from "@/constants"

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
                                title="Alumni Information"
                                description="View and manage alumni."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs bg='bg-muted' title="Alumni Information" link={ROUTES.ALUMNI} />
                            <SidebarNavs title="Tracer Map" link={ROUTES.TRACER_MAP} />
                            {/* <SidebarNavs title="Google Form" link={ROUTES.GOOGLE_FORM} /> */}
                        </Sidebar>
                        <MainTable>
                            {alumniLoading && <div>Loading...</div>}
                            {
                                (!alumniLoading && alumniFetched) &&
                                <DataTableStudentAlumni
                                    columns={StudentAlumniColumns}
                                    data={dataAlumni?.data || []}
                                />
                            }
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}