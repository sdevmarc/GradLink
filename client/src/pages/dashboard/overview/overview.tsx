import HeadSection, { SubHeadSectionDetails } from "@/components/head-section";
import './index.css'

export default function Overview() {
    return (
        <div className="w-full flex flex-col min-h-screen items-center">
            <main className="w-full max-w-[90rem] flex flex-col">
                <aside className="px-4 pb-4 pt-[8rem]">
                    <HeadSection>
                        <SubHeadSectionDetails
                            title=" Overview"
                            description="A dashboard providing analytics and insights into alumni data, student, system health and trends."
                        />
                    </HeadSection>
                </aside>
                <div className="py-4 h-[54rem]">
                    {/* Main content */}
                </div>
            </main>
        </div>
    )
}