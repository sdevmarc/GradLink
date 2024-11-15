import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import MainTable from "@/components/main-table"
import { ROUTES } from "@/constants"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CircleCheck, CircleX, Download, Pencil, Send, Trash2, UploadCloud, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { API_USER_CREATE_USER, API_USER_GET_ALL_USERS, API_USER_UPDATE_TO_INACTIVE_USER, API_USER_UPDATE_USER } from "@/api/user"
import { IAPIUsers } from "@/interface/user.interface"
import { Combobox } from "@/components/combobox"
import Loading from "@/components/loading"

export default function Security() {
    const queryClient = useQueryClient()
    const [userBeingUpdated, setUserBeingUpdated] = useState<string | null>(null)
    const [userDialogUpdating, setUserDialogUpdating] = useState<string | null>(null)
    const [isupdateuser, setUpdateUser] = useState<boolean>(false)
    const [isdialogdeleteuser, setDialogDeleteUser] = useState<boolean>(false)
    const [isdialogadduser, setDialogAddUser] = useState<boolean>(false)
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })
    const [users, setUsers] = useState<IAPIUsers[]>([])
    const [values, setValues] = useState<IAPIUsers>({
        name: '',
        email: '',
        role: ''
    })
    const [updatevalue, setUpdateValues] = useState<IAPIUsers>({
        userid: '',
        name: '',
        email: '',
        role: ''
    })
    const [backupData, setBackupData] = useState('')
    const [backupStatus, setBackupStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const { data: userdata, isLoading: userdataLoading, isFetched: userdataFetched } = useQuery({
        queryFn: () => API_USER_GET_ALL_USERS(),
        queryKey: ['security']
    })

    useEffect(() => {
        if (userdataFetched) {
            setUsers(userdata?.data)
        }
    }, [userdataFetched])

    const roles_options = [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'Department Head' }
    ]

    const { mutateAsync: insertUser, isPending: insertuserPending } = useMutation({
        mutationFn: API_USER_CREATE_USER,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogAddUser(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['users-security'] })
                await queryClient.refetchQueries({ queryKey: ['users-security'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setDialogAddUser(false)
                setValues(({ email: '', name: '', role: '' }))
                return
            }
        },
        onError: (data) => {
            setDialogAddUser(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const { mutateAsync: updateUser, isPending: updateuserPending } = useMutation({
        mutationFn: API_USER_UPDATE_USER,
        onSuccess: async (data) => {
            if (!data.success) {
                setUpdateUser(false)
                setUserBeingUpdated(null)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['security'] })
                await queryClient.refetchQueries({ queryKey: ['security'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setUpdateUser(false)
                setUserBeingUpdated(null)
                setUpdateValues(({ userid: '', email: '', name: '', role: '' }))
                return
            }
        },
        onError: (data) => {
            setUpdateUser(false)
            setUserBeingUpdated(null)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const { mutateAsync: inactiveuser, isPending: inactiveuserPending } = useMutation({
        mutationFn: API_USER_UPDATE_TO_INACTIVE_USER,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogDeleteUser(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['security'] })
                await queryClient.refetchQueries({ queryKey: ['security'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setDialogDeleteUser(false)
                setUpdateValues(({ userid: '', email: '', name: '', role: '' }))
                return
            }
        },
        onError: (data) => {
            setDialogAddUser(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleAddUser = async () => {
        const { email, name, role } = values

        const loweremail = (email ?? '').replace(/\s+/g, '').toLowerCase()
        const nospacename = (name ?? '').replace(/\s+/g, '')

        if (loweremail === '' || nospacename === '' || !role) {
            setDialogAddUser(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please fill-up the required fields.' })
            return
        }

        await insertUser({ email, name, role })
        setDialogAddUser(false)
    }

    const handleDeleteUser = async ({ userid }: IAPIUsers) => {
        await inactiveuser({ userid })
        setDialogDeleteUser(false)
    }

    const handleUpdateUser = async () => {
        const { userid, email, name, role } = updatevalue

        const loweremail = (email ?? '').replace(/\s+/g, '').toLowerCase()
        const nospacename = (name ?? '').replace(/\s+/g, '')

        console.log({ userid, email, name, role })

        if (loweremail === '' || nospacename === '' || !role || !userid) {
            setUpdateUser(false)
            setUserBeingUpdated(null)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please fill-up the required fields.' })
            return
        }

        await updateUser({ userid, email, name, role })
        setUpdateUser(false)
        setUserBeingUpdated(null)
    }

    const isLoading = userdataLoading || insertuserPending || updateuserPending || inactiveuserPending

    return (
        isLoading ? <Loading /> :
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
                                                    value={values.name}
                                                    disabled={userBeingUpdated !== null}
                                                    onChange={(e) => setValues(prev => ({ ...prev, name: e.target.value }))}
                                                />
                                                <Input
                                                    placeholder="Email"
                                                    type="email"
                                                    value={values.email}
                                                    disabled={userBeingUpdated !== null}
                                                    onChange={(e) => setValues(prev => ({ ...prev, email: e.target.value }))}
                                                />
                                                <div className="w-2/3">
                                                    <Combobox
                                                        className='w-[200px]'
                                                        lists={roles_options || []}
                                                        placeholder={`Select Role`}
                                                        setValue={(item) => setValues(prev => ({ ...prev, role: item }))}
                                                        value={values.role || ''}
                                                    />
                                                </div>
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
                                                    {
                                                        (userdataFetched && users.length > 0) &&

                                                        users.map((user: IAPIUsers) => (
                                                            <TableRow key={user._id}>
                                                                <TableCell className="capitalize">{
                                                                    userBeingUpdated === user._id ?
                                                                        <Input
                                                                            className="normal-case"
                                                                            placeholder="Name"
                                                                            value={updatevalue.name || user.name}
                                                                            onChange={(e) => setUpdateValues(prev => ({ ...prev, name: e.target.value }))}
                                                                        />
                                                                        : user.name
                                                                }</TableCell>
                                                                <TableCell className="lowercase">{
                                                                    userBeingUpdated === user._id ?
                                                                        <Input
                                                                            className="normal-case"
                                                                            placeholder="Email"
                                                                            value={updatevalue.email || user.email}
                                                                            onChange={(e) => setUpdateValues(prev => ({ ...prev, email: e.target.value }))}
                                                                        />
                                                                        : user.email
                                                                }</TableCell>
                                                                <TableCell className="capitalize">
                                                                    {
                                                                        userBeingUpdated === user._id ?
                                                                            user.role === 'root' ? <Input className="normal-case w-1/2" placeholder="Role" value={'Root'} disabled />
                                                                                :
                                                                                <Combobox
                                                                                    className='w-[200px]'
                                                                                    lists={roles_options || []}
                                                                                    placeholder={`Select Role`}
                                                                                    setValue={(item) => setUpdateValues(prev => ({ ...prev, role: item }))}
                                                                                    value={updatevalue.role || user.role || ''}
                                                                                />
                                                                            : user.role === 'root' ? 'Root'
                                                                                : user.role === 'admin' ? 'Admin'
                                                                                    : user.role === 'user' && 'Department Head'
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-4">
                                                                        {
                                                                            userBeingUpdated !== user._id ?
                                                                                <AlertDialogConfirmation
                                                                                    isDialog={userDialogUpdating === user._id}
                                                                                    setDialog={(open) => {
                                                                                        if (open) {
                                                                                            setUserDialogUpdating(user._id ?? null)
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
                                                                                        setUserBeingUpdated(user._id ?? null)
                                                                                        setUpdateValues(prev => ({
                                                                                            ...prev,
                                                                                            userid: user._id,
                                                                                            email: user.email,
                                                                                            name: user.name,
                                                                                            role: user.role
                                                                                        }))
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
                                                                                                handleUpdateUser()
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
                                                                            userBeingUpdated !== user._id &&
                                                                                user.role === 'root' ? null :
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
                                                                                    btnContinue={() => handleDeleteUser({ userid: user._id })
                                                                                    }
                                                                                />
                                                                        }
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>
                                            </Table>

                                        </div>
                                    </CardContent>
                                </Card>
                                {/* <Card>
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
                                </Card> */}
                            </MainTable>
                        </main>
                    </div>
                </div >
            </>
    )
}