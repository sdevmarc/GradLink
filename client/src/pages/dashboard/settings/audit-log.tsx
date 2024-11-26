import { API_GET_AUDIT_LOGS } from "@/api/settings"
import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import MainTable from "@/components/main-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IAPIAuditlog } from "@/interface/settings.interface"
import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { DataTableAudit } from "./settings-data-table-components/data-table-list-of-audit"
import { AuditColumns } from "./settings-data-table-components/columns-student-list-of-audit"

export default function AuditLog() {
    const [auditlogs, setAuditlogs] = useState<IAPIAuditlog[]>([])

    const { data: auditlog, isLoading: auditlogLoading, isFetched: auditlogFetched } = useQuery({
        queryFn: () => API_GET_AUDIT_LOGS(),
        queryKey: ['audit']
    })

    const ACTION_LABELS = {
        user_login: 'User Login',
        settings_changed: 'Settings Change',
        user_created: 'User Change',
        password_changed: 'Password Change',
        program_changed: 'Program Change',
        course_changed: 'Course Change',
        curriculum_changed: 'Curriculum Change',
        semester_changed: 'Semester Change',
        student_changed: 'Student Change'
    } as const

    useEffect(() => {
        if (auditlogFetched) {
            const filterlogs = auditlog?.data?.map((item: IAPIAuditlog) => {
                const { _id, action, description, updatedAt, name } = item;

                return {
                    id: _id,
                    action: ACTION_LABELS[action as keyof typeof ACTION_LABELS] || action, // Fallback to original action if not found
                    details: description,
                    timestamp: updatedAt,
                    user: name
                }
            }) || [];

            setAuditlogs(filterlogs);
        }
    }, [auditlog, auditlogFetched]);

    // const [auditLogs, setAuditLogs] = useState([
    //     { id: 1, timestamp: '2024-11-06T02:30:00Z', user: 'John Doe', action: 'User Login', details: 'Successful login from IP 192.168.1.1' },
    //     { id: 2, timestamp: '2024-11-06T03:15:00Z', user: 'Jane Smith', action: 'Settings Changed', details: 'Updated email notifications preferences' },
    //     { id: 3, timestamp: '2024-11-06T04:00:00Z', user: 'Admin', action: 'User Created', details: 'New user account created for Alice Johnson' },
    //     { id: 4, timestamp: '2024-11-06T05:30:00Z', user: 'John Doe', action: 'Password Changed', details: 'User changed their account password' },
    //     { id: 5, timestamp: '2024-11-06T06:45:00Z', user: 'System', action: 'Backup Created', details: 'Automatic system backup completed' },
    // ])
    const [auditLogFilter, setAuditLogFilter] = useState('')
    const [auditLogActionFilter, setAuditLogActionFilter] = useState('')

    const filteredAuditLogs = auditlogs.filter(log =>
        ((log.user ?? '').toLowerCase().includes(auditLogFilter.toLowerCase()) ||
            (log.action ?? '').toLowerCase().includes(auditLogFilter.toLowerCase()) ||
            (log.details ?? '').toLowerCase().includes(auditLogFilter.toLowerCase())) &&
        (auditLogActionFilter === '' || log.action === auditLogActionFilter)
    )

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