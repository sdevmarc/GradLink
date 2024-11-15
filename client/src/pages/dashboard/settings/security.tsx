import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import MainTable from "@/components/main-table"
import { ROUTES } from "@/constants"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CircleCheck, CircleX, Download, Pencil, Send, Trash2, UploadCloud, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialogConfirmation } from "@/components/alert-dialog"

export default function Security() {
    const [userBeingUpdated, setUserBeingUpdated] = useState<number | null>(null)
    const [userDialogUpdating, setUserDialogUpdating] = useState<number | null>(null)
    const [isupdateuser, setUpdateUser] = useState<boolean>(false)
    const [isdialogdeleteuser, setDialogDeleteUser] = useState<boolean>(false)
    const [isdialogadduser, setDialogAddUser] = useState<boolean>(false)
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    ])
    const [roles, setRoles] = useState<string>('')
    const [backupData, setBackupData] = useState('')
    const [backupStatus, setBackupStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const roles_options = ['Admin', 'Department Head']

    const handleAddUser = async () => {
        setDialogAddUser(false)
    }

    const handleDeleteUser = async () => {
        setDialogDeleteUser(false)
    }

    const handleNameChange = (e: any, userId: number) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, name: e.target.value } : user
            )
        )
    }

    return (
        <>
            <AlertDialogConfirmation
                btnTitle='Continue'
                className='w-full py-4'
                isDialog={alertdialogstate.show}
                setDialog={(open) => setAlertDialogState(prev => ({ ...prev, show: open }))}
                type={`alert`}
                title={alertdialogstate.title}
                description={alertdialogstate.description}
                icon={alertdialogstate.success ? <CircleCheck color="#42a626" size={70} /> : <CircleX color="#880808" size={70} />}
                variant={`default`}
                btnContinue={() => setAlertDialogState(prev => ({ ...prev, show: false }))}
            />
            <div className="flex flex-col min-h-screen items-center">
            <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
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
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                            <Input
                                                placeholder="Name"
                                                disabled={userBeingUpdated !== null}
                                            />
                                            <Input
                                                placeholder="Email"
                                                type="email"
                                                disabled={userBeingUpdated !== null}
                                            />
                                            <Select onValueChange={() => setRoles('')} disabled={userBeingUpdated !== null}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles_options.map((role) => (
                                                        <SelectItem key={role} value={role}>{role}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <AlertDialogConfirmation
                                                isDialog={isdialogadduser}
                                                setDialog={(open) => setDialogAddUser(open)}
                                                type={`default`}
                                                disabled={userBeingUpdated !== null}
                                                className='w-full py-[1.1rem]'
                                                variant={'default'}
                                                btnTitle="Create user"
                                                title="Are you sure?"
                                                description={`This will create a new user, and may have the ability to read, write, and execute in the system.`}
                                                btnContinue={handleAddUser}
                                            />
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
                                                        <TableCell>{
                                                            userBeingUpdated === user.id ?
                                                                <Input placeholder="Name" value={user.name} onChange={(e) => handleNameChange(e, user.id)} />
                                                                : user.name
                                                        }</TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell>{user.role}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-4">
                                                                {
                                                                    userBeingUpdated !== user.id ?
                                                                        <AlertDialogConfirmation
                                                                            isDialog={userDialogUpdating === user.id}
                                                                            setDialog={(open) => {
                                                                                if (open) {
                                                                                    setUserDialogUpdating(user.id)
                                                                                } else {
                                                                                    setUserDialogUpdating(null)
                                                                                }
                                                                            }}
                                                                            type={`default`}
                                                                            disabled={false}
                                                                            className='py-[1.1rem]'
                                                                            variant={`outline`}
                                                                            btnIcon={<Pencil className="text-primary" size={18} />}
                                                                            title="Are you sure?"
                                                                            description={`This will modify the information of the user.`}
                                                                            btnContinue={() => {
                                                                                setUserDialogUpdating(null)
                                                                                setUserBeingUpdated(user.id)
                                                                            }}
                                                                        />
                                                                        :
                                                                        (
                                                                           <>
                                                                                <AlertDialogConfirmation
                                                                                    isDialog={isupdateuser}
                                                                                    setDialog={(open) => setUpdateUser(open)}
                                                                                    type={`default`}
                                                                                    disabled={false}
                                                                                    className='py-[1.1rem] flex items-center gap-2'
                                                                                    variant={`default`}
                                                                                    btnTitle="Update user"
                                                                                    btnIcon={<Send className="text-primary-foreground" size={18} />}
                                                                                    title="Are you sure?"
                                                                                    description={`This will update the user's information.`}
                                                                                    btnContinue={() => {
                                                                                        setUpdateUser(false)
                                                                                        setUserBeingUpdated(null)
                                                                                    }}
                                                                                />
                                                                                <Button onClick={() => {
                                                                                    setUserBeingUpdated(null)
                                                                                }}
                                                                                    variant={`outline`}
                                                                                    size={`sm`}
                                                                                    className="py-[1.1rem] flex items-center gap-2"
                                                                                >
                                                                                    <X className="text-primary" size={18} />  Cancel
                                                                                </Button>
                                                                            </>
                                                                        )

                                                                }

                                                                {
                                                                    userBeingUpdated !== user.id &&
                                                                    <AlertDialogConfirmation
                                                                        isDialog={isdialogdeleteuser}
                                                                        setDialog={(open) => setDialogDeleteUser(open)}
                                                                        type={`default`}
                                                                        disabled={false}
                                                                        className='py-[1.1rem]'
                                                                        variant={`destructive`}
                                                                        btnIcon={<Trash2 className="text-primary-foreground" size={18} />}
                                                                        title="Are you sure?"
                                                                        description={`This will set the user to inactive and cannot read, write, and execute in the system.`}
                                                                        btnContinue={handleDeleteUser}
                                                                    />
                                                                }
                                                            </div>
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