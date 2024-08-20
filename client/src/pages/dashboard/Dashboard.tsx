import { DCalendar } from "@/components/calendar";
import HeadSection, { SubHeadSectionDetails } from "@/components/head-section";
import Header_Dashboard from "@/components/header-dashboard";
import { Button } from "@/components/ui/button";
import './index.css'
import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <div className="flex flex-col min-h-screen items-center">
            <Header_Dashboard />
            <div className="w-full max-w-[90rem] flex-1 flex">
                <main className="w-3/4 px-4 pb-4 pt-[5rem]">
                    <HeadSection>
                        <SubHeadSectionDetails
                            title=" Overview"
                            description="A dashboard providing analytics and insights into alumni data, student, system health and trends."
                        />
                    </HeadSection>
                    <div className="py-4 h-[54rem]">
                        {/* Main content */}
                    </div>
                </main>
                <aside className="w-1/4 sticky top-[8dvh] h-[calc(100vh-8dvh)] overflow-y-auto border-x-[0.7px] border-black/10 p-4 flex flex-col justify-start gap-3">
                    <DCalendar />
                    <div className="h-[50%] flex flex-col justify-between border-[0.7px] border-black/10 rounded-sm p-2">
                        <div className="flex justify-between items-center pb-2 px-2">
                            <h1 className="text-text text-sm font-semibold">
                                Schedule
                            </h1>
                            <Button variant="default" size="icon">
                                +
                            </Button>
                        </div>
                        <div className="schedule overflow-auto flex-1 flex flex-col gap-3 px-1">
                            <ScheduleTabs />
                            <ScheduleTabs />
                            <ScheduleTabs />
                            <ScheduleTabs />
                            <ScheduleTabs />
                            <ScheduleTabs />
                            <ScheduleTabs />
                            <ScheduleTabs />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

const ScheduleTabs = () => {
    return (
        <div className="p-2 bg-background rounded-sm shadow-[_0_7px_10px_-3px_rgba(0,0,0,0.1)] flex items-center gap-4">
            <div className="w-[17%] h-full bg-black/40 rounded-sm"></div>
            <div className="w-[63%] flex flex-col gap-1">
                <h1 className="text-text text-sm font-semibold line-clamp-1">
                    MIT
                </h1>
                <p className="text-text text-[.7rem] line-clamp-1">
                    10:30 AM - 12:00 NN
                </p>
            </div>
            <Link to="/dashboard" className="px-4 py-1 bg-primary rounded-md text-text font-semibold text-[.6rem]">
                VIEW
            </Link>
        </div>
    )
}