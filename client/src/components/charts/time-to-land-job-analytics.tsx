"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    count: { label: "Count", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

export function TimeToLandJobAnalytics({ data }: { data: any[]}) {

    const transformedData = data.map(item => ({
        category: item._id,   // Use _id as the category or label for X-axis
        count: item.count     // Use count as the value for Y-axis
    }));

    return (
        <Card className="border-none shadow-none">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>
                        Time of Alumni landing their job.
                    </CardTitle>
                    <CardDescription>
                        Showing analytics from alumni responses in landing their job.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={transformedData || []}>
                        <defs>
                            <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="category"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent labelFormatter={(value) => value} indicator="dot" />}
                        />
                        <Area
                            dataKey="count" // Use count for the area chart values
                            type="natural"
                            fill="url(#fillCount)"
                            stroke="var(--color-count)"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
