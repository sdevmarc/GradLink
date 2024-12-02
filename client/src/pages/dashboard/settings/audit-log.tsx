import { API_GET_AUDIT_LOGS } from "@/api/settings"
import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import MainTable from "@/components/main-table"
import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { DataTableAudit } from "./settings-data-table-components/data-table-list-of-audit"
import { AuditColumns } from "./settings-data-table-components/columns-student-list-of-audit"
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "@/hooks/AuthContext"
import { API_USER_CHECK_DEFAULT_PASSWORD } from "@/api/user"

export default function AuditLog() {
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
        queryKey: ['check-password']
    })

    useEffect(() => {
        if (checkpasswordFetched) {
            if (!checkpassword.success) {
               navigate('/overview')
            } 
        }
    }, [checkpassword])

    const { data: auditlog, isLoading: auditlogLoading, isFetched: auditlogFetched } = useQuery({
        queryFn: () => API_GET_AUDIT_LOGS(),
        queryKey: ['audit']
    })

    return (
        <div className="flex flex-col min-h-screen items-center">
            <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                <aside className="px-4 pb-4 pt-[8rem]">
                    <HeadSection>
                        <SubHeadSectionDetails
                            title="Audit Log"
                            description="View a log of important actions and changes within the system."
                        />
                    </HeadSection>
                </aside>
                <main className="flex px-8">
                    <MainTable className="w-full pb-[12rem]">
                        <Card className="border-none shadow-none">
                            <CardContent className="px-0">
                                {auditlogLoading && <div>Loading...</div>}
                                {
                                    (!auditlogLoading && auditlogFetched) &&
                                    <DataTableAudit
                                        columns={AuditColumns}
                                        data={auditlog.data || []}
                                    />
                                }
                            </CardContent>
                        </Card>
                    </MainTable>
                </main>
            </div>
        </div>
    )
}