"use client"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { formatCurrency } from "@/lib/utils"
import { calculateTrendChanges, generateTrends } from "@/lib/generateTrends"
import { defaultCategories } from "@/lib/contsants"
import { ArrowDown, ArrowUp, Wallet } from "lucide-react"
import { Transaction, TrendData } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"
import { getTrasactions } from "@/lib/fetch"
import { toast } from "sonner"


export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('30')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    netIncome: 0,
    savingsRate: 0,
    expensesRate: 0,
  })
  const [trends, setTrends] = useState<TrendData[]>([])
  const [changes, setChanges] = useState({
    incomeChange: 0,
    expenseChange: 0,
    netChange: 0,
  })
  const isMobile = useIsMobile()
  useEffect(() => {
    if (isMobile) {
      setTimeRange('7')
    }
  }, [isMobile])

  // Reusable filter function using useCallback
  const getFilteredTransactions = useCallback(
    (data: Transaction[]) => {
      const referenceDate = new Date()
      const startDate = new Date(referenceDate)
      startDate.setDate(referenceDate.getDate() - Number(timeRange))

      return data.filter((item) => {
        const date = new Date(item.createdAt)
        return date >= startDate && date <= referenceDate
      })
    },
    [timeRange]
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTrasactions();
        const filtered = getFilteredTransactions(res);
        setTransactions(filtered);

        // ✅ Dynamically compute summary from filtered transactions
        const income = filtered
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);

        const expenses = filtered
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);

        const netIncome = income - expenses;
        const savingsRate = income > 0 ? Math.round((netIncome / income) * 100) : 0;
        const expensesRate = expenses > 0 ? Math.round((netIncome / expenses) * 100) : 0;

        setSummary({
          income,
          expenses,
          netIncome,
          savingsRate,
          expensesRate,
        });
      } catch {
        toast.error("Failed to fetch transactions")
        // console.error("Failed to fetch transactions:", error);
      }
    };

    fetchData();
  }, [getFilteredTransactions]);


  useEffect(() => {
    const trendData = generateTrends(transactions, defaultCategories)
    setTrends(trendData)
    const calculatedChanges = calculateTrendChanges(trendData)
    setChanges(calculatedChanges)
  }, [transactions])

  return (
    <div className="flex-1 space-y-4 md:p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h2>
          <p className="text-slate-600">Overview of your financial activity</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
            size="sm"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income Card */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <ArrowUp className="text-emerald-600 text-lg" />
              </div>
              <span className={`text-sm ${changes.incomeChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {changes.incomeChange >= 0 ? "+" : ""}
                {changes.incomeChange}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {formatCurrency(summary?.income || "0")}
            </h3>
            <p className="text-slate-500 text-sm">Total Income</p>
          </CardContent>
        </Card>

        {/* Total Expenses Card */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <ArrowDown className="text-red-600 text-lg" />
              </div>
              <span className={`text-sm ${changes.expenseChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {changes.expenseChange >= 0 ? "+" : ""}
                {changes.expenseChange}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {formatCurrency(summary?.expenses || "0")}
            </h3>
            <p className="text-slate-500 text-sm">Total Expenses</p>
          </CardContent>
        </Card>

        {/* Net Income Card */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="text-blue-600 text-lg" />
              </div>
              <span className={`text-sm ${changes.netChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {changes.netChange >= 0 ? "+" : ""}
                {changes.netChange}%
              </span>

            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {formatCurrency(summary?.netIncome || "0")}
            </h3>
            <p className="text-slate-500 text-sm">Net Income</p>
          </CardContent>
        </Card>
      </div>

      <Overview data={trends} days={timeRange} />

      {transactions.length === 0 ? (
        <EmptyPlaceholder />
      ) : (
        <RecentTransactions transactions={transactions} />
      )}
    </div>
  )
}
