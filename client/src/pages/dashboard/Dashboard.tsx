import { DCalendar } from "@/components/Calendar";
import HeadSection from "@/components/HeadSection";
import Header_Dashboard from "@/components/header/Header_Dashboard";
import { Button } from "@/components/ui/button";
import './index.css'
import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <>
            <div className="w-full flex flex-col justify-center items-center">
                <Header_Dashboard />
                <div className="w-full max-w-[90rem] flex justify-between items-start">
                    <div className="w-[75%] h-full flex-flex-col px-4">
                        <HeadSection />
                        <div className="w-full py-4 h-[54rem]">

                        </div>
                    </div>
                    <div className="sticky top-[3.9rem] right-0 w-[25%] h-[93dvh] border-x-[0.7px] border-black/20 p-4 flex flex-col justify-between items-center">
                        <DCalendar />
                        <div className="w-full flex flex-col justify-center items-center gap-2">
                            <div className="w-full flex justify-between items-center px-4">
                                <h1 className="text-text font-semibold text-xl">
                                    Schedule
                                </h1>
                                <Button variant={`default`} size={`icon`}>
                                    +
                                </Button>
                            </div>
                            <div className="schedule overflow-auto w-full h-[30rem] flex flex-col justify-start items-center gap-4 px-2">
                                <div className="w-full p-2 bg-muted rounded-sm shadow-[_0_10px_15px_-3px_rgba(0,0,0,0.1)] flex justify-start items-center gap-4">
                                    <div className="w-[17%] h-full bg-white rounded-sm">

                                    </div>

                                    <div className="w-[83%] flex flex-col justify-center items-start gap-1">
                                        <div className="w-full flex justify-between items-center">
                                            <h1 className="text-text font-semibold line-clamp-1">
                                                MIT
                                            </h1>
                                            <Link to={`/dashboard`} className="px-4 py-1 bg-primary rounded-md text-text font-semibold text-[.6rem]">
                                                VIEW
                                            </Link>
                                        </div>

                                        <p className="w-[70%] text-text text-[.7rem] line-clamp-1">
                                            10:30 AM - 12:00 NN
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
