import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import MainTable from "@/components/main-table"
import { ROUTES } from "@/constants"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, PlusCircle, Trash2, UploadCloud } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Security() {
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    ])
    const [roles, setRoles] = useState(['Admin', 'User', 'Editor'])
    const [backupData, setBackupData] = useState('')
    const [backupStatus, setBackupStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="Account Settings"
                                description="View and manage settings."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="General" link={ROUTES.GENERAL_SETTINGS} />
                            <SidebarNavs bg='bg-muted' title="Security" link={ROUTES.SECURITY} />
                        </Sidebar>
                        <MainTable className="flex flex-col gap-4 pb-[12rem]">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Manage Users</CardTitle>
                                    <CardDescription>Add, edit, or remove users from your system.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <Input
                                                placeholder="Name"
                                            />
                                            <Input
                                                placeholder="Email"
                                                type="email"
                                            />
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role} value={role}>{role}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Add User
                                            </Button>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Role</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {users.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell>{user.name}</TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell>{user.role}</TableCell>
                                                        <TableCell>
                                                            <Button variant="destructive" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">Delete user</span>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Backup & Restore</CardTitle>
                                    <CardDescription>Create backups of your settings or restore from a previous backup.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium">Create Backup</h3>
                                            <p className="text-sm text-muted-foreground mb-2">Generate a backup of your current settings.</p>
                                            <Button>
                                                <Download className="mr-2 h-4 w-4" /> Create Backup
                                            </Button>
                                            {backupData && (
                                                <div className="mt-4">
                                                    <Label htmlFor="backupData">Backup Data</Label>
                                                    <Textarea
                                                        id="backupData"

                                                        value={backupData}
                                                        readOnly
                                                        className="h-32 font-mono text-xs"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium">Restore Settings</h3>
                                            <p className="text-sm text-muted-foreground mb-2">Restore your settings from a backup file or by pasting backup data.</p>
                                            <div className="space-y-2">
                                                <div>
                                                    <Label htmlFor="restoreFile" className="cursor-pointer">
                                                        <div className="flex items-center space-x-2">
                                                            <UploadCloud className="w-4 h-4" />
                                                            <span>Upload Backup File</span>
                                                        </div>
                                                    </Label>
                                                    <Input
                                                        id="restoreFile"
                                                        type="file"
                                                        accept=".json"
                                                        className="hidden"
                                                    />
                                                </div>
                                                <Textarea
                                                    placeholder="Or paste your backup data here"
                                                    className="h-32 font-mono text-xs"
                                                />
                                                <Button>
                                                    Restore Settings
                                                </Button>
                                            </div>
                                        </div>
                                        {backupStatus && (
                                            <Alert variant={backupStatus.type === 'error' ? 'destructive' : 'default'}>
                                                <AlertTitle>{backupStatus.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
                                                <AlertDescription>{backupStatus.message}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}