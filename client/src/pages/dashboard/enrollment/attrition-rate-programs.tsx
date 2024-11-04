import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { useQuery } from "@tanstack/react-query"
import { API_FINDALL_COURSES_OFFERED } from "@/api/offered"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { ROUTES } from "@/constants"
import MainTable from "@/components/main-table"
import { DataTableAttritionRatePrograms } from "./enrollment-data-table-components/attrition-rate-programs/data-table-attrition-rate-programs."
import { AttritionRateCoursestColumns } from "./enrollment-data-table-components/attrition-rate-courses/columns-attrition-rate-courses"

export default function AttritionRatePrograms() {
    const { data: courses, isLoading: coursesLoading, isFetched: coursesFetched } = useQuery({
        queryFn: () => API_FINDALL_COURSES_OFFERED(),
        queryKey: ['courses-offered']
    })

    return (
        <div className="flex flex-col min-h-screen items-center">
            <div className="w-full max-w-[90rem] flex flex-col">
                <aside className="px-4 pb-4 pt-[8rem]">
                    <HeadSection>
                        <SubHeadSectionDetails
                            title="ATTRTION RATE OF PROGRAMS"
                            description={`View attrion rate for programs.`}
                        />
                    </HeadSection>
                </aside>
                <main className="flex">
                    <Sidebar>
                        <SidebarNavs title="Courses Offered" link={ROUTES.ENROLLMENT} />
                        <SidebarNavs title="Attrition Rate of Courses" link={ROUTES.ENROLLMENT_ATTRITION_RATE_COURSES} />
                        <SidebarNavs bg='bg-muted' title="Attrition Rate of Programs" link={ROUTES.ENROLLMENT_ATTRITION_RATE_PROGRAMS} />
                    </Sidebar>
                    <MainTable>
                        {coursesLoading && <div>Loading...</div>}
                        {
                            (!coursesLoading && coursesFetched) &&
                            <DataTableAttritionRatePrograms
                                columns={AttritionRateCoursestColumns}
                                data={courses?.data || []}
                            />
                        }
                    </MainTable>
                </main>
            </div>
        </div>
    )
}