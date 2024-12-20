import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { useQuery } from "@tanstack/react-query"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { ROUTES } from "@/constants"
import MainTable from "@/components/main-table"
import { DataTableAttritionRatePrograms } from "./enrollment-data-table-components/attrition-rate-programs/data-table-attrition-rate-programs."
import { AttritionRateProgramsColumns } from "./enrollment-data-table-components/attrition-rate-programs/columns-attrition-rate-programs"
import { API_PROGRAM_FINDALL } from "@/api/program"
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "@/hooks/AuthContext"
import { API_USER_CHECK_DEFAULT_PASSWORD } from "@/api/user"

export default function AttritionRatePrograms() {
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

    const { data: program, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['programs']
    })

    return (
        <div className="flex flex-col min-h-screen items-center">
 <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                <aside className="px-4 pb-4 pt-[8rem]">
                    <HeadSection>
                        <SubHeadSectionDetails
                            title="Attrition Rate for Programs"
                            description={`View attrition rate for programs.`}
                        />
                    </HeadSection>
                </aside>
                <main className="flex">
                    <Sidebar>
                        <SidebarNavs title="Offered Courses" link={ROUTES.ENROLLMENT} />
                        <SidebarNavs title="Attrition Rate of Courses" link={ROUTES.ENROLLMENT_ATTRITION_RATE_COURSES} />
                        <SidebarNavs bg='bg-muted' title="Attrition Rate of Programs" link={ROUTES.ENROLLMENT_ATTRITION_RATE_PROGRAMS} />
                    </Sidebar>
                    <MainTable>
                        {programLoading && <div>Loading...</div>}
                        {
                            (!programLoading && programFetched) &&
                            <DataTableAttritionRatePrograms
                                columns={AttritionRateProgramsColumns}
                                data={program?.data || []}
                            />
                        }
                    </MainTable>
                </main>
            </div>
        </div>
    )
}