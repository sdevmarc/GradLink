"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface IData {
    count: number
    reason: string
}

// // Dummy data for common reasons
// const chartData = [
//     { reason: "Financial Difficulties", count: 1 },
//     { reason: "Personal or Family Reasons", count: 0 },
//     { reason: "Health Issues", count: 0 },
//     { reason: "Work or Career Commitments", count: 0 },
//     { reason: "Lack of Interest in the Program", count: 0 },
//     { reason: "Relocation or Moving", count: 0 },
//     { reason: "Dissatisfaction with the Program", count: 0 },
//     { reason: "Better Opportunities Elsewhere", count: 2 },
//     { reason: "Time Constraints", count: 3 },
//     { reason: "Change in Career Goals", count: 1 },
//     { reason: "Academic Challenges", count: 0 },
//     { reason: "Transfer to Another Institution", count: 0 },
//     { reason: "Visa or Immigration Issues", count: 0 },
//     { reason: "Discrimination or Uncomfortable Environment", count: 0 },
//     { reason: "Lack of Support from Faculty or Staff", count: 0 },
//     { reason: "Program Not Meeting Expectations", count: 2 },
//     { reason: "Family Emergency", count: 1 },
//     { reason: "Not Ready for Academic Rigor", count: 3 },
//     { reason: "Poor Mental Health", count: 4 },
//     { reason: "Completion of Specific Goals", count: 2 },
//     { reason: "Others", count: 0 },
// ]

const chartConfig = {
    count: {
        label: "Count",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function BarChartCommonReasons({ data }: { data: IData[] }) {
    return (
        <Card className="w-full border-none shadow-none">
            <CardContent className="h-[30rem]">
                <ChartContainer config={chartConfig} className="w-full h-full">
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="reason"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            // tickFormatter={(value) => value.slice(0, 3)}
                            tick={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-center gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Showing total data based on common reasons for leaving
                </div>
            </CardFooter>
        </Card>
    )
}