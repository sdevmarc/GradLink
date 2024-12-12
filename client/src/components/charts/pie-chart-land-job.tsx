"use client"

import * as React from "react"
import { Label, Pie, PieChart, Cell } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface IData {
    key: string
    count: number
    department?: string
    program?: string
    academicYear?: string
}

// Define your chartConfig with keys mapping to labels and colors
const chartConfig: ChartConfig = {
    'Less than a month': { label: 'Less than a month', color: 'hsl(var(--chart-1))' },
    '1 to 6 months': { label: '1 to 6 months', color: 'hsl(var(--chart-2))' },
    '7 to 11 months': { label: '7 to 11 months', color: 'hsl(var(--chart-3))' },
    '1 year to less than 2 years': { label: '1 year to less than 2 years', color: 'hsl(var(--chart-4))' },
    '2 years to less than 3 years': { label: '2 years to less than 3 years', color: 'hsl(var(--chart-5))' },
    '3 years to less than 4 years': { label: '3 years to less than 4 years', color: 'hsl(var(--chart-6))' },
    'More than 4 years': { label: 'More than 4 years', color: 'hsl(var(--chart-7))' },
} satisfies ChartConfig;

export function PieChartLandJob({ data, isClickCell }: { data: IData[], isClickCell: (e: boolean) => void }) {
    // Map the data to the format required by the chart
    const chartData = React.useMemo(() => {
        if (data && data.length > 0) {
            return data.map((item) => ({
                key: item.key,
                count: item.count,
            }))
        }
        return []
    }, [data])

    // Compute the total number of respondents
    const totalRespondents = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + (curr.count || 0), 0)
    }, [chartData])

    // Extract the academic year from the data
    const academicYear = React.useMemo(() => {
        if (data && data.length > 0) {
            // Assuming all entries have the same academicYear
            return data[0].academicYear || ''
        }
        return ''
    }, [data])

    return (
        <Card className="flex flex-col shadow-none border-none">
            <CardHeader className="items-center pb-0">
                <CardTitle>
                    Post-Graduation Job Acquisition Timing for Alumni
                </CardTitle>
                <CardDescription className="text-lg font-bold text-primary">{academicYear}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        {/* <Legend /> */}
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="key"
                            innerRadius={60}
                            strokeWidth={5}
                        // label
                        >

                            {chartData.map((entry, index) => (
                                <Cell
                                    className="hover:cursor-pointer"
                                    key={`cell-${index}`}
                                    fill={chartConfig[entry.key]?.color || '#000000'}
                                    onClick={() => isClickCell(true)}
                                />
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalRespondents.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Respondents
                                                </tspan>
                                            </text>
                                        )
                                    }
                                    return null
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground text-center max-w-[30rem]">
                    Showing analytics from alumni respondents regarding the time duration it took them to land their first job.
                </div>
            </CardFooter>
        </Card>
    )
}
