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
import { CircleCheck, CircleX, Eye, EyeOff, Save, UserRoundPen, X } from "lucide-react"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { API_FINDONE_SETTINGS, API_UPDATE_SETTINGS } from "@/api/settings"
import Loading from "@/components/loading"

export default function GeneralSettings() {
    const queryClient = useQueryClient()
    const [ischangepassword, setChangePassword] = useState<boolean>(false)
    const [isevaluate, setEvaluate] = useState<boolean>(false)
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
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/placeholder.svg',
        bio: 'I am a software developer.',
        theme: 'light',
        notifications: true,
        language: 'en',
    })

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

    const isLoading = settingsLoading || updatesettingsLoading

    return (
        <>
            {isLoading && <Loading />}
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
                            <SidebarNavs bg='bg-muted' title="General" link={ROUTES.GENERAL_SETTINGS} />
                            {/* <SidebarNavs title="Security" link={ROUTES.SECURITY} /> */}
                        </Sidebar>
                        <MainTable className="pb-[12rem] flex flex-col gap-8">
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
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
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={profile.email}
                                            />
                                        </div>
                                        <div className="flex items-center justify-end">
                                            <AlertDialogConfirmation
                                                className="flex items-center py-4 gap-2"
                                                type={`default`}
                                                variant={'default'}
                                                btnIcon={<Save className="text-primary-foreground" size={18} />}
                                                btnTitle="Save Changes"
                                                title="Are you sure?"
                                                description={`This will change your current information.`}
                                                btnContinue={() => setChangePassword(false)}
                                            />
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>
                            {
                                !ischangepassword &&
                                <div className="flex">
                                    <Button onClick={() => setChangePassword(true)} variant={`outline`} size={`sm`} type='button' className='flex gap-2'>
                                        <UserRoundPen className='text-primary' size={18} /> Change Password
                                    </Button>
                                </div>
                            }
                            {
                                ischangepassword &&
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between">
                                            <div className="flex flex-col gap-2">
                                                <CardTitle>Change Password</CardTitle>
                                                <CardDescription>Manage your password here.</CardDescription>
                                            </div>
                                            <div className="">
                                                <Button
                                                    onClick={() => setChangePassword(false)}
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
                                                <div className="space-y-2">
                                                    <Label htmlFor="current-password">Current Password</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="current-password"
                                                            name="current-password"
                                                            type={showPassword.current ? "text" : "password"}

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
                                                <div className="space-y-2">
                                                    <Label htmlFor="new-password">New Password</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="new-password"
                                                            type={showPassword.new ? "text" : "password"}
                                                            name="new-password"
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
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <AlertDialogConfirmation
                                                    className="flex items-center py-4 gap-2"
                                                    type={`default`}
                                                    variant={'default'}
                                                    btnIcon={<Save className="text-primary-foreground" size={18} />}
                                                    btnTitle="Save Changes"
                                                    title="Are you sure?"
                                                    description={`This will change your current password.`}
                                                    btnContinue={() => setChangePassword(false)}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            } */}

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