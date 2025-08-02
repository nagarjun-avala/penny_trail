// components/overview.tsx
"use client"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendData } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

const chartConfig = {
  spending: {
    label: "Spending",
  },
  date: {
    label: "Date",
    color: "var(--primary)",
  },
  amount: {
    label: "Amount",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function Overview({ data, days }: { data: TrendData[], days: string }) {

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Spending Trends</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last {days} days
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="income"
              type="natural"
              fill="#d0fae5"
              stroke="oklch(59.6% 0.145 163.225)"
              stackId="a"
            />
            <Area
              dataKey="expenses"
              type="natural"
              fill="#ffe2e2"
              stroke="oklch(57.7% 0.245 27.325)"
              stackId="b"
            />
            <Area
              dataKey="net"
              type="natural"
              fill="#dbeafe"
              stroke="#155dfc"
              stackId="c"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
