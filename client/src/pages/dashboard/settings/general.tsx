import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import MainTable from "@/components/main-table"
import { ROUTES } from "@/constants"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { CircleCheck, CircleX, Eye, EyeOff, Save, UserCheck, UserRoundPen, X } from "lucide-react"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { API_FINDONE_SETTINGS, API_UPDATE_SETTINGS } from "@/api/settings"
import Loading from "@/components/loading"
import { API_USER_CHANGE_PASSWORD, API_USER_CHECK_PASSWORD, API_USER_GET_USER, API_USER_UPDATE_INFORMATION } from "@/api/user"

export default function GeneralSettings() {
    const queryClient = useQueryClient()
    const [ischangepassword, setChangePassword] = useState<boolean>(false)
    const [isevaluate, setEvaluate] = useState<boolean>(false)
    const [ispassword, setPassword] = useState<boolean>(false)
    const [currentpassword, setCurrentPassword] = useState<string>('')
    const [dialogsubmit, setDialogSubmit] = useState<boolean>(false)
    const [dialogname, setDialogName] = useState<boolean>(false)
    const [dialogemail, setDialogEmail] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        repeat: false
    })
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        password: ''
    })

    const { data: userdata, isLoading: userdataLoading, isFetched: userdataFetched } = useQuery({
        queryFn: () => API_USER_GET_USER(),
        queryKey: ['users']
    })

    useEffect(() => {
        if (userdataFetched) {
            setProfile(prev => ({
                ...prev,
                name: userdata?.data?.name,
                email: userdata?.data?.email
            }))
        }
    }, [])

    const { data: settings, isLoading: settingsLoading, isFetched: settingsFetched } = useQuery({
        queryFn: () => API_FINDONE_SETTINGS(),
        queryKey: ['settings']
    })

    useEffect(() => {
        if (settingsFetched) { setEvaluate(settings?.data?.isenroll) }
    }, [settings])

    const { mutateAsync: updatesettings, isPending: updatesettingsLoading } = useMutation({
        mutationFn: API_UPDATE_SETTINGS,
        onSuccess: async (data) => {
            if (!data.success) {
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['settings'] })
                await queryClient.refetchQueries({ queryKey: ['settings'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                return
            }
        },
        onError: (data) => {
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const { mutateAsync: updateinformation, isPending: updateinformationLoading } = useMutation({
        mutationFn: API_USER_UPDATE_INFORMATION,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogName(false)
                setDialogEmail(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['settings'] })
                await queryClient.refetchQueries({ queryKey: ['settings'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setDialogName(false)
                setDialogEmail(false)
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                return
            }
        },
        onError: (data) => {
            setDialogName(false)
            setDialogEmail(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const { mutateAsync: checkpassword, isPending: checkpasswordLoading } = useMutation({
        mutationFn: API_USER_CHECK_PASSWORD,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogSubmit(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['general'] })
                await queryClient.refetchQueries({ queryKey: ['general'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setDialogSubmit(false)
                setChangePassword(true)
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setCurrentPassword('')
                return
            }
        },
        onError: (data) => {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const { mutateAsync: changepassword, isPending: changepasswordLoading } = useMutation({
        mutationFn: API_USER_CHANGE_PASSWORD,
        onSuccess: async (data) => {
            if (!data.success) {
                setDialogSubmit(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['general'] })
                await queryClient.refetchQueries({ queryKey: ['general'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setDialogSubmit(false)
                setChangePassword(false)
                setPassword(false)
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                setCurrentPassword('')
                setProfile(prev => ({ ...prev, password: '' }))
                return
            }
        },
        onError: (data) => {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleUpdateName = async () => {
        const { name } = profile
        const nospacename = (name ?? '').replace(/\s+/g, '')

        if (nospacename === '') {
            setDialogName(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Password should not be empty.' })
            return
        }

        await updateinformation({ userid: userdata?.data?._id, name })
        setDialogName(false)
    }

    const handleUpdateEmail = async () => {
        const { email } = profile
        const nospaceemail = (email ?? '').replace(/\s+/g, '').toLowerCase()

        if (nospaceemail === '') {
            setDialogEmail(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Password should not be empty.' })
            return
        }

        await updateinformation({ userid: userdata?.data?._id, email })
        setDialogEmail(false)
    }

    const handleSubmitPassword = async () => {
        const nospacecurrentpassword = (currentpassword ?? '').replace(/\s+/g, '')
        const nospacepassword = (profile.password ?? '').replace(/\s+/g, '')

        if (!ischangepassword) {

            if (nospacecurrentpassword === '') {
                setDialogSubmit(false)
                setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Password should not be empty.' })
                return
            }

            await checkpassword({ userid: userdata?.data?._id, password: currentpassword })
            setDialogSubmit(false)
            return
        }

        if (nospacecurrentpassword === '' || nospacepassword === '') {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Password should not be empty.' })
            return
        }

        if (nospacecurrentpassword !== nospacepassword) {
            setDialogSubmit(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Password do not match' })
            return
        }
        setDialogSubmit(false)
        await changepassword({ userid: userdata?.data?._id, password: currentpassword })
        return

    }

    const isLoading = settingsLoading || updatesettingsLoading || userdataLoading || checkpasswordLoading || changepasswordLoading || updateinformationLoading

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
                            {
                                userdataFetched &&
                                <Sidebar>
                                    <SidebarNavs bg='bg-muted' title="General" link={ROUTES.GENERAL_SETTINGS} />
                                    {
                                        (userdata?.data?.role === 'root' || userdata?.data?.role === 'root') &&
                                        <SidebarNavs title="Security" link={ROUTES.SECURITY} />
                                    }
                                </Sidebar>
                            }

                            <MainTable className="pb-[12rem] flex flex-col gap-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Name Information</CardTitle>
                                        <CardDescription>Customize your personal information.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={profile.name}
                                                    onChange={(e) => setProfile(prev => ({
                                                        ...prev,
                                                        name: e.target.value
                                                    }))}
                                                />
                                            </div>

                                            <div className="flex items-center justify-end">
                                                <AlertDialogConfirmation
                                                    isDialog={dialogname}
                                                    setDialog={(open) => setDialogName(open)}
                                                    className="flex items-center py-[1.1rem] gap-2"
                                                    type={`default`}
                                                    variant={'default'}
                                                    btnIcon={<Save className="text-primary-foreground" size={18} />}
                                                    btnTitle="Save Changes"
                                                    title="Are you sure?"
                                                    description={`This will change your current information.`}
                                                    btnContinue={handleUpdateName}
                                                />
                                            </div>
                                        </div>

                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Email Information</CardTitle>
                                        <CardDescription>Customize your personal information.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={profile.email}
                                                    onChange={(e) => setProfile(prev => ({
                                                        ...prev,
                                                        email: e.target.value
                                                    }))}
                                                />
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <AlertDialogConfirmation
                                                    isDialog={dialogemail}
                                                    setDialog={(open) => setDialogEmail(open)}
                                                    className="flex items-center py-[1.1rem] gap-2"
                                                    type={`default`}
                                                    variant={'default'}
                                                    btnIcon={<Save className="text-primary-foreground" size={18} />}
                                                    btnTitle="Save Changes"
                                                    title="Are you sure?"
                                                    description={`This will change your current information.`}
                                                    btnContinue={handleUpdateEmail}
                                                />
                                            </div>
                                        </div>

                                    </CardContent>
                                </Card>
                                {
                                    !ispassword &&
                                    <div className="flex">
                                        <Button onClick={() => setPassword(true)} variant={`outline`} size={`sm`} type='button' className='flex gap-2'>
                                            <UserRoundPen className='text-primary' size={18} /> Change Password
                                        </Button>
                                    </div>
                                }
                                {
                                    ispassword &&
                                    <Card>
                                        <CardHeader>
                                            <div className="flex justify-between">
                                                <div className="flex flex-col gap-2">
                                                    <CardTitle>Change Password</CardTitle>
                                                    <CardDescription>Manage your password here.</CardDescription>
                                                </div>
                                                <div className="">
                                                    <Button
                                                        onClick={() => {
                                                            setPassword(false)
                                                            setChangePassword(false)
                                                        }
                                                        }
                                                        variant={`ghost`}
                                                        size={`sm`}
                                                        type='button'
                                                    >
                                                        <X className='text-primary' size={18} /> Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                <div className="flex flex-col max-w-[400px]">
                                                    {
                                                        !ischangepassword &&
                                                        <>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="current-password">Current Password</Label>
                                                                <div className="relative">
                                                                    <Input
                                                                        id="current-password"
                                                                        name="current-password"
                                                                        type={showPassword.current ? "text" : "password"}
                                                                        value={currentpassword}
                                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                        onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                                                                    >
                                                                        {showPassword.current ? (
                                                                            <EyeOff className="h-4 w-4" />
                                                                        ) : (
                                                                            <Eye className="h-4 w-4" />
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </>

                                                    }
                                                    {
                                                        ischangepassword &&
                                                        <>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="new-password">New Password</Label>
                                                                <div className="relative">
                                                                    <Input
                                                                        id="new-password"
                                                                        type={showPassword.new ? "text" : "password"}
                                                                        name="new-password"
                                                                        value={profile.password}
                                                                        onChange={(e) => setProfile(prev => ({ ...prev, password: e.target.value }))}
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                        onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                                                    >
                                                                        {showPassword.new ? (
                                                                            <EyeOff className="h-4 w-4" />
                                                                        ) : (
                                                                            <Eye className="h-4 w-4" />
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="repeat-password">Repeat Password</Label>
                                                                <div className="relative">
                                                                    <Input
                                                                        id="repeat-password"
                                                                        name="repeat-password"
                                                                        type={showPassword.repeat ? "text" : "password"}
                                                                        value={currentpassword}
                                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                        onClick={() => setShowPassword(prev => ({ ...prev, repeat: !prev.repeat }))}
                                                                    >
                                                                        {showPassword.repeat ? (
                                                                            <EyeOff className="h-4 w-4" />
                                                                        ) : (
                                                                            <Eye className="h-4 w-4" />
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    }

                                                </div>

                                                <div className="flex items-center justify-end">
                                                    <AlertDialogConfirmation
                                                        isDialog={dialogsubmit}
                                                        setDialog={(open) => setDialogSubmit(open)}
                                                        className="flex items-center py-[1.1rem] gap-2"
                                                        type={`default`}
                                                        variant={'default'}
                                                        btnIcon={<UserCheck className="text-primary-foreground" size={18} />}
                                                        btnTitle={`${ischangepassword ? 'Save Changes' : 'Check Password'}`}
                                                        title="Are you sure?"
                                                        description={ischangepassword ? 'This will change your current password.' : 'This will check if the current password matches your input.'}
                                                        btnContinue={handleSubmitPassword}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                }

                                <Card>
                                    <CardHeader>
                                        <CardTitle>System Settings</CardTitle>
                                        <CardDescription>Customize your system settings.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="notifications"
                                                    checked={!isevaluate}
                                                    onCheckedChange={() => {
                                                        setEvaluate(!isevaluate)
                                                        updatesettings({ isenroll: !isevaluate })
                                                    }}
                                                />
                                                <Label htmlFor="notifications">Enable Evaluation Mode</Label>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Preferences</CardTitle>
                                        <CardDescription>Customize your personal preferences.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2">
                                                <ModeToggle />
                                                <h1 className="text-sm font-medium">Dark Mode</h1>
                                            </div>
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