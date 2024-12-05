import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import MainTable from "@/components/main-table"
import { ROUTES } from "@/constants"
import { DataTableAlumniGoogleForm } from "./alumni-data-table-components/google-form/data-table-google-form"
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_USER_CHECK_DEFAULT_PASSWORD } from "@/api/user"
import { useQuery } from "@tanstack/react-query"
import { AuthContext } from "@/hooks/AuthContext"
import { API_FORM_FINDALL_TRACER, API_FORM_MAPPED } from "@/api/form"
import { AlumniGoogleFormColumns } from "./alumni-data-table-components/google-form/columns-google-form"

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

    const { data: dataForm, isLoading: isformLoading, isFetched: formFetched } = useQuery({
        queryFn: () => API_FORM_FINDALL_TRACER(),
        queryKey: ['forms']
    })

    const { data: formmapdata, isLoading: formmapLoading, isFetched: formmapFetched } = useQuery({
        queryFn: () => API_FORM_MAPPED(),
        queryKey: ['form']
    })

    useEffect(() => {
        if (formFetched) { console.log(formmapdata?.message) }
    }, [formmapdata, formmapFetched])

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
                            <SidebarNavs bg='bg-muted' title="Tracer Respondents" link={ROUTES.GOOGLE_FORM} />
                        </Sidebar>
                        <MainTable>
                            {isformLoading && <div>Loading...</div>}
                            {
                                (!isformLoading && formFetched) &&
                                <DataTableAlumniGoogleForm
                                    isSync={formmapLoading}
                                    columns={AlumniGoogleFormColumns}
                                    data={dataForm?.data || []}
                                />
                            }
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}