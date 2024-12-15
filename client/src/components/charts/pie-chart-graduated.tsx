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

const dummyData: IData[] = [
    { key: 'Master in Information Technology', count: 2, academicYear: '2023-2024' },
    { key: 'Master in Engineering', count: 1, academicYear: '2023-2024' },
    { key: 'Master in Developmental Arts and Designs', count: 0, academicYear: '2023-2024' },
    { key: 'Master in Library and Information Science', count: 2, academicYear: '2023-2024' },
]

// Generate chartConfig dynamically from dummyData
const chartConfig: ChartConfig = dummyData.reduce((config, item, index) => {
    const dynamicColor = `hsl(var(--chart-${index + 1}))`; // Generate dynamic colors
    config[item.key] = { label: item.key, color: dynamicColor };
    return config;
}, {} as ChartConfig);

export function PieChartGraduated({ data, isClickCell }: { data: IData[], isClickCell?: (e: boolean) => void }) {
    // Map the data to the format required by the chart
    const chartData = React.useMemo(() => {
        if (dummyData && dummyData.length > 0) {
            return dummyData.map((item) => ({
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
                    Graduate Success Metrics
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
                            innerRadius={55}
                            strokeWidth={5}
                        // label
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    className="hover:cursor-pointer"
                                    key={`cell-${index}`}
                                    fill={chartConfig[entry.key]?.color || '#000000'}
                                    onClick={() => isClickCell && isClickCell(true)}
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
                                                    Graduates
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
                    Presenting analytics on graduates.
                </div>
            </CardFooter>
        </Card>
    )
}
