import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import MainTable from "@/components/main-table"
import { ROUTES } from "@/constants"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export default function GeneralSettings() {
    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/placeholder.svg',
        bio: 'I am a software developer.',
        theme: 'light',
        notifications: true,
        language: 'en',
    })
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
                            <SidebarNavs bg='bg-muted' title="General" link={ROUTES.GENERAL_SETTINGS} />
                            <SidebarNavs title="Security" link={ROUTES.SECURITY} />
                        </Sidebar>
                        <MainTable className="pb-[12rem]">
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Profile</CardTitle>
                                    <CardDescription>Customize your personal information and preferences.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="w-20 h-20">
                                                <AvatarImage src={profile.avatar} alt={profile.name} />
                                                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <Label htmlFor="avatar" className="cursor-pointer">
                                                    <div className="flex items-center space-x-2">
                                                        <Upload className="w-4 h-4" />
                                                        <span>Change Avatar</span>
                                                    </div>
                                                </Label>
                                                <Input
                                                    id="avatar"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>
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
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="notifications"
                                                checked={profile.notifications}
                                            />
                                            <Label htmlFor="notifications">Enable Create Program</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="notifications"
                                                checked={profile.notifications}
                                            />
                                            <Label htmlFor="notifications">Enable Create Course</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="notifications"
                                                checked={profile.notifications}
                                            />
                                            <Label htmlFor="notifications">Enable Create Curriculum</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="notifications"
                                                checked={profile.notifications}
                                            />
                                            <Label htmlFor="notifications">Enable Create Course Offered</Label>
                                        </div>

                                        <Button>Save Changes</Button>
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