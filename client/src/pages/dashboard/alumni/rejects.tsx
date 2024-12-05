import HeadSection, { BackHeadSection, SubHeadSectionDetails } from "@/components/head-section"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import MainTable from "@/components/main-table"
import { ROUTES } from "@/constants"
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_USER_CHECK_DEFAULT_PASSWORD } from "@/api/user"
import { useQuery } from "@tanstack/react-query"
import { AuthContext } from "@/hooks/AuthContext"
import { API_FORM_GET_REJECTS } from "@/api/form"
import { DataTableAlumniRejects } from "./alumni-data-table-components/rejects/data-table-rejects"
import { AlumniRejectsColumns } from "./alumni-data-table-components/rejects/columns-rejects"

export default function AlumniRejects() {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            // Redirect to login page if not authenticated
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate])

    const { data: checkpassword, isFetched: checkpasswordFetched } = useQuery({
        queryFn: () => API_USER_CHECK_DEFAULT_PASSWORD(),
        queryKey: ['checkpassword']
    })

    useEffect(() => {
        if (checkpasswordFetched) {
            if (!checkpassword.success) {
                navigate('/overview')
            }
        }
    }, [checkpassword])

    const { data: rejects, isLoading: rejectsLoading, isFetched: rejectsFetched } = useQuery({
        queryFn: () => API_FORM_GET_REJECTS(),
        queryKey: ['rejects']
    })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <BackHeadSection />
                            <SubHeadSectionDetails
                                title="REJECT RESPONDENTS"
                                description="View and manage rejects respondents."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Alumni Information" link={ROUTES.ALUMNI} />
                            <SidebarNavs title="Tracer Map" link={ROUTES.TRACER_MAP} />
                            <SidebarNavs bg='bg-muted' title="Tracer Respondents" link={ROUTES.GOOGLE_FORM} />
                        </Sidebar>
                        <MainTable>
                            {rejectsLoading && <div>Loading...</div>}
                            {
                                (!rejectsLoading && rejectsFetched) &&
                                <DataTableAlumniRejects
                                    columns={AlumniRejectsColumns}
                                    data={rejects?.data || []}
                                />
                            }
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}