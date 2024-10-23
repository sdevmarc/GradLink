import HeadSection, { SubHeadSectionDetails } from "@/components/head-section";
import './index.css'
import { PieChartComponent } from "@/components/charts/pie-chart";
import { BarChartCustomeLabelComponent } from "@/components/charts/bar-chart-custom-label";
import { BarChartMixedComponent } from "@/components/charts/bar-chart-mixed";

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
                <div className="py-4 flex justify-evenly items-center flex-wrap gap-6">
                    {/* <PieChartComponent />
                    <BarChartCustomeLabelComponent />
                    <BarChartMixedComponent />
                    <PieChartComponent />
                    <BarChartCustomeLabelComponent />
                    <BarChartMixedComponent />
                    <PieChartComponent />
                    <BarChartCustomeLabelComponent /> */}
                </div>
            </main>
        </div>
    )
}