import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import MainTable from "@/components/main-table"
import { ROUTES } from "@/constants"
import { DataTableAlumniGoogleForm } from "./alumni-data-table-components/google-form/data-table-google-form"

export default function GoogleForm() {
    // const { data: dataForm, isLoading: isformLoading, isFetched: formFetched } = useQuery({
    //     queryFn: () => API_FORM_FINDALL_UNKNOWN(),
    //     queryKey: ['forms']
    // })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="RESPONDENTS"
                                description="View and manage google form respondents."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Alumni Information" link={ROUTES.ALUMNI} />
                            <SidebarNavs title="Tracer Map" link={ROUTES.TRACER_MAP} />
                            <SidebarNavs bg='bg-muted' title="Google Form" link={ROUTES.GOOGLE_FORM} />
                        </Sidebar>
                        <MainTable>

                            <DataTableAlumniGoogleForm
                                columns={[]}
                                data={[]}
                            />
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}