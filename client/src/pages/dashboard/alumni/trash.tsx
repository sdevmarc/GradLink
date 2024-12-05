import HeadSection, { BackHeadSection, SubHeadSectionDetails } from "@/components/head-section"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import MainTable from "@/components/main-table"
import { ROUTES } from "@/constants"
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_USER_CHECK_DEFAULT_PASSWORD } from "@/api/user"
import { useQuery } from "@tanstack/react-query"
import { AuthContext } from "@/hooks/AuthContext"
import { DataTableAlumniTrash } from "./alumni-data-table-components/trash/data-table-trash"
import { AlumniTrashColumns } from "./alumni-data-table-components/trash/columns-trash"
import { API_STUDENT_ALUMNI_TRASHED } from "@/api/student"

export default function AlumniTrash() {
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

    const { data: alumnitrashed, isLoading: alumnitrashedLoading, isFetched: alumnitrashedFetched } = useQuery({
        queryFn: () => API_STUDENT_ALUMNI_TRASHED(),
        queryKey: ['alumnitrashed']
    })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <BackHeadSection />
                            <SubHeadSectionDetails
                                title="TRASHED ALUMNI INFORMATION"
                                description="View and manage alumni information."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs bg='bg-muted' title="Alumni Information" link={ROUTES.ALUMNI} />
                            <SidebarNavs title="Tracer Map" link={ROUTES.TRACER_MAP} />
                            <SidebarNavs title="Tracer Respondents" link={ROUTES.GOOGLE_FORM} />
                        </Sidebar>
                        <MainTable>
                            {alumnitrashedLoading && <div>Loading...</div>}
                            {
                                (!alumnitrashedLoading && alumnitrashedFetched) &&
                                <DataTableAlumniTrash
                                    isSync={alumnitrashedLoading}
                                    columns={AlumniTrashColumns}
                                    data={alumnitrashed?.data || []}
                                />
                            }
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}