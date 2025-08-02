import { Category, Transaction, TrendData } from "./types";


export function generateTrends(
    transactions: Transaction[],
    categories: Category[]
): TrendData[] {
    const dateMap: Record<string, TrendData> = {};

    // Build category lookup
    const categoryTypeMap: Record<string, "income" | "expenses"> = {};
    for (const cat of categories) {
        categoryTypeMap[cat.name] = cat.type;
    }

    for (const tx of transactions) {
        const date = tx.date;
        const type = categoryTypeMap[tx.category] ?? "expense"; // fallback to expense

        if (!dateMap[date]) {
            dateMap[date] = { date, income: 0, expenses: 0, net: 0 };
        }

        if (type === "income") {
            dateMap[date].income += tx.amount;
        } else {
            dateMap[date].expenses += tx.amount;
        }
    }

    return Object.values(dateMap).map((t) => ({
        ...t,
        net: t.income - t.expenses, // net = income - expense
    }));
}


export function calculateTrendChanges(data: TrendData[]) {
    if (data.length < 2) return { incomeChange: 0, expenseChange: 0, netChange: 0 }

    const half = Math.floor(data.length / 2)
    const previous = data.slice(0, half)
    const recent = data.slice(half)

    const sum = (arr: TrendData[], key: "income" | "expenses") =>
        arr.reduce((acc, item) => acc + item[key], 0)

    const prevIncome = sum(previous, "income")
    const recentIncome = sum(recent, "income")

    const prevExpense = sum(previous, "expenses")
    const recentExpense = sum(recent, "expenses")

    const incomeChange = prevIncome > 0 ? ((recentIncome - prevIncome) / prevIncome) * 100 : 0
    const expenseChange = prevExpense > 0 ? ((recentExpense - prevExpense) / prevExpense) * 100 : 0

    const prevNet = prevIncome - prevExpense
    const recentNet = recentIncome - recentExpense

    const netChange = prevNet !== 0 ? ((recentNet - prevNet) / Math.abs(prevNet)) * 100 : 0

    return {
        incomeChange: Math.round(incomeChange),
        expenseChange: Math.round(expenseChange),
        netChange: Math.round(netChange),
    }
}
