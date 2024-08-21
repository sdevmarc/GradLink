import Header_Dashboard from '@/components/header-dashboard'
import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'

export default function PostForm() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <Header_Dashboard />
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[5rem]">
                        <HeadSection>
                            <BackHeadSection />
                            <SubHeadSectionDetails
                                title="CREATE A GOOGLE FORM"
                                description="A feature for building and customizing Google Forms to gather and organize information efficiently."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="List" link="/form" />
                            <SidebarNavs title="Trash" link="/" />
                        </Sidebar>
                        <CreateForm />
                    </main>
                </div>
            </div>
        </>
    )
}


const CreateForm = () => {
    return (
        <>
            <div className="w-[80%] flex flex-col justify-between rounded-lg border">
                <div className="w-full px-4 py-3 border-b">
                    <h1 className='text-text font-semibold text-lg'>Configure Form</h1>
                </div>
                <div className="w-full py-2 flex flex-col gap-2">
                    <div className="flex flex-col px-4">
                        <h1 className='text[1rem]'>Form Name</h1>
                        <input type="text" placeholder='eg. Alumni Graduates Survey' className='border placeholder:text-sm px-4 py-2 rounded-md' />
                    </div>
                </div>
            </div>
        </>
    )
}