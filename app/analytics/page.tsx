'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { useMemo } from "react";
import { dummyTransactions } from "@/data/dummyTransactions";
import { defaultCategories } from "@/lib/contsants";
import {
    AreaChart,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    Bar,
    BarChart,
    Area,
    ResponsiveContainer,
} from "recharts";
import { formatCurrency, generateExpenseCategories, generateMonthlyData } from "@/lib/utils";
import { ChartPie } from "lucide-react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";


const COLORS = [
    "#F97316",
    "#3B82F6",
    "#8B5CF6",
    "#EF4444",
    "#10B981",
    "#EC4899",
    "#F59E0B",
    "#6B7280",
];

const chartConfig = {
    income: {
        label: "Income",
        color: "var(--chart-1)",

    },
    expenses: {
        label: "Expenses",
        color: "var(--chart-2)",

    },
} satisfies ChartConfig

export default function Analytics() {
    const transactions = dummyTransactions
    const categories = defaultCategories

    const expenseCategories = generateExpenseCategories(transactions)


    const summary = useMemo(() => {
        const income = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter((t) => t.type === "expenses")
            .reduce((sum, t) => sum + t.amount, 0);
        const netIncome = income - expenses;
        const savingsRate = income > 0 ? Math.round((netIncome / income) * 100) : 0;

        const groupedByDay: Record<string, { income: number; expenses: number }> =
            {};
        transactions.forEach((t) => {
            const key = new Date(t.createdAt).toISOString().split("T")[0];
            if (!groupedByDay[key]) {
                groupedByDay[key] = { income: 0, expenses: 0 };
            }
            if (t.type === "income") {
                groupedByDay[key].income += t.amount;
            } else if (t.type === "expenses") {
                groupedByDay[key].expenses += t.amount;
            }
        });

        const avgDailySpending =
            Object.values(groupedByDay).reduce((sum, day) => sum + day.expenses, 0) /
            Object.keys(groupedByDay).length;

        const topCategory = categories
            .filter((c) => c.type === "expenses")
            .map((c) => ({
                ...c,
                total: transactions
                    .filter((t) => t.category === c.name)
                    .reduce((s, t) => s + t.amount, 0),
            }))
            .sort((a, b) => b.total - a.total)[0]?.name;

        return {
            income,
            expenses,
            netIncome,
            savingsRate,
            avgDailySpending,
            topCategory,
            totalTransactions: transactions.length,
        };
    }, [transactions, categories]);

    const pieData = useMemo(() => {
        return categories
            .filter((cat) => cat.type === "expenses")
            .map((cat, index) => {
                const totalAmount = transactions
                    .filter((t) => t.category === cat.name)
                    .reduce((sum, t) => sum + t.amount, 0);
                return {
                    name: cat.name,
                    value: totalAmount,
                    color: cat.color || COLORS[index % COLORS.length],
                };
            })
            .filter((d) => d.value > 0);
    }, [transactions, categories]);

    const spendingTrends = useMemo(() => {
        const map: Record<string, { income: number; expenses: number }> = {};
        transactions.forEach((t) => {
            const key = new Date(t.createdAt).toISOString().split("T")[0];
            if (!map[key]) map[key] = { income: 0, expenses: 0 };
            if (t.type === "income") {
                map[key].income += t.amount;
            } else if (t.type === "expenses") {
                map[key].expenses += t.amount;
            }
        });

        return Object.entries(map)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([date, value]) => ({ date, ...value }));
    }, [transactions]);

    const monthlyData = generateMonthlyData(spendingTrends)

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h2>
                <p className="text-slate-600">Detailed insights into your spending</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Avg. Daily Spending Card */}
                <Card>
                    <CardContent>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-medium text-slate-600">Avg. Daily Spending</h3>
                            <i className="fas fa-calendar-day text-slate-400"></i>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary?.avgDailySpending | 0)}</p>
                        <p className="text-sm text-slate-500 mt-1">Last 30 days</p>
                    </CardContent>
                </Card>

                {/* Top Category Card */}
                <Card>
                    <CardContent>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-medium text-slate-600">Top Category</h3>
                            <i className="fas fa-crown text-slate-400"></i>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{summary?.topCategory}</p>
                        <p className="text-sm text-slate-500 mt-1">
                            {expenseCategories.find(cat => cat.name === summary?.topCategory)?.percentage?.toFixed(1) || 0}% of expenses
                        </p>
                    </CardContent>
                </Card>

                {/* Savings Rate Card */}
                <Card>
                    <CardContent>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-medium text-slate-600">Savings Rate</h3>
                            <i className="fas fa-piggy-bank text-slate-400"></i>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{summary?.savingsRate}%</p>
                        <p className={`text-sm mt-1 ${Number(summary?.savingsRate) >= 20 ? 'text-emerald-600' : 'text-orange-600'}`}>
                            {Number(summary?.savingsRate) >= 20 ? 'Above average' : 'Below average'}
                        </p>
                    </CardContent>
                </Card>

                {/* Total Transactions count Card */}
                <Card>
                    <CardContent>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-medium text-slate-600">Transactions</h3>
                            <i className="fas fa-receipt text-slate-400"></i>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{summary?.totalTransactions}</p>
                        <p className="text-sm text-slate-500 mt-1">This month</p>
                    </CardContent>
                </Card>
            </div>


            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Expense Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Expense Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pieData.length === 0 ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <ChartPie className="text-slate-300 text-4xl mb-3" />
                                    <p className="text-slate-500">No expense data available</p>
                                </div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={120}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Amount']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Monthly Comparison */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart accessibilityLayer data={monthlyData.slice(-6)}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    className="text-xs"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <YAxis
                                    className="text-xs"
                                    tickLine={false}
                                    tickMargin={0}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value}`}
                                />

                                <Tooltip
                                    formatter={(value: number, name) => [formatCurrency(value), name]}
                                />
                                <Legend />
                                <Bar dataKey="income" fill="oklch(59.6% 0.145 163.225)" name="Income" radius={4} />
                                <Bar dataKey="expenses" fill="oklch(57.7% 0.245 27.325)" name="Expenses" radius={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Spending Timeline */}
                {spendingTrends.length > 0 && (
                    <div className="xl:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Spending Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                                    <AreaChart data={spendingTrends}>
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
                                    {/* <LineChart data={spendingTrends}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            className="text-xs"
                                        />
                                        <YAxis className="text-xs" />
                                        <Tooltip
                                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                            formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="expenses"
                                            stroke="#EF4444"
                                            strokeWidth={2}
                                            name="Expenses"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="income"
                                            stroke="#10B981"
                                            strokeWidth={2}
                                            name="Income"
                                        />
                                    </LineChart> */}
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div >
    );
}
