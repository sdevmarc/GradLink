import { API_USER_GET_USER } from "@/api/user"
import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import MainTable from "@/components/main-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { useState } from "react"

export default function AuditLog() {
    const [auditLogs, setAuditLogs] = useState([
        { id: 1, timestamp: '2024-11-06T02:30:00Z', user: 'John Doe', action: 'User Login', details: 'Successful login from IP 192.168.1.1' },
        { id: 2, timestamp: '2024-11-06T03:15:00Z', user: 'Jane Smith', action: 'Settings Changed', details: 'Updated email notifications preferences' },
        { id: 3, timestamp: '2024-11-06T04:00:00Z', user: 'Admin', action: 'User Created', details: 'New user account created for Alice Johnson' },
        { id: 4, timestamp: '2024-11-06T05:30:00Z', user: 'John Doe', action: 'Password Changed', details: 'User changed their account password' },
        { id: 5, timestamp: '2024-11-06T06:45:00Z', user: 'System', action: 'Backup Created', details: 'Automatic system backup completed' },
    ])
    const [auditLogFilter, setAuditLogFilter] = useState('')
    const [auditLogActionFilter, setAuditLogActionFilter] = useState('')

    // const { data: userdata, isLoading: userdataLoading, isFetched: userdataFetched } = useQuery({
    //     queryFn: () => API_USER_GET_USER(),
    //     queryKey: ['users']
    // })

    const filteredAuditLogs = auditLogs.filter(log =>
        (log.user.toLowerCase().includes(auditLogFilter.toLowerCase()) ||
            log.action.toLowerCase().includes(auditLogFilter.toLowerCase()) ||
            log.details.toLowerCase().includes(auditLogFilter.toLowerCase())) &&
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
                                <div className="space-y-4">
                                    <div className="flex space-x-2">
                                        <div className="relative flex-grow">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search logs..."
                                                value={auditLogFilter}
                                                onChange={(e) => setAuditLogFilter(e.target.value)}
                                                className="pl-8"
                                            />
                                        </div>
                                        <Select value={auditLogActionFilter} onValueChange={setAuditLogActionFilter}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Filter by action" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Actions</SelectItem>
                                                <SelectItem value="User Login">User Login</SelectItem>
                                                <SelectItem value="Settings Changed">Settings Changed</SelectItem>
                                                <SelectItem value="User Created">User Created</SelectItem>
                                                <SelectItem value="Password Changed">Password Changed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[180px]">Timestamp</TableHead>
                                                <TableHead>User</TableHead>
                                                <TableHead>Action</TableHead>
                                                <TableHead className="hidden md:table-cell">Details</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredAuditLogs.map((log) => (
                                                <TableRow key={log.id}>
                                                    <TableCell className="font-mono text-xs">
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>{log.user}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{log.action}</Badge>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">{log.details}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </MainTable>
                </main>
            </div>
        </div>
    )
}