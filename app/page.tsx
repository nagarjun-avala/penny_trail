"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { formatCurrency } from "@/lib/utils"
import { dummyTransactions } from "@/data/dummyTransactions"
import { calculateTrendChanges, generateTrends } from "@/lib/generateTrends"
import { defaultCategories } from "@/lib/contsants"
import { ArrowDown, ArrowUp, Wallet } from "lucide-react"
import { TrendData } from "@/lib/types"

const dummySummary = {
  income: 1200,
  expenses: 650,
}

type summayType = {
  income: number
  expenses: number
  netIncome: number
  savingsRate: number
  expenseRate: number
}

export default function DashboardPage() {
  const [days, setDays] = useState(7)
  const [summary, setSummary] = useState<summayType>()
  const [trends, setTrends] = useState<TrendData[]>([])
  const [transactions, setTransactions] = useState(dummyTransactions.slice(-days))
  const [changes, setChanges] = useState({
    incomeChange: 0,
    expenseChange: 0,
    netChange: 0,
  })

  useEffect(() => {
    const trendData = generateTrends(dummyTransactions, defaultCategories)
    setTrends(trendData)

    const calculatedChanges = calculateTrendChanges(trendData)
    setChanges(calculatedChanges)
  }, [])

  useEffect(() => {
    const { income, expenses } = dummySummary
    const netIncome = income - expenses;
    const savingsRate = income > 0 ? Math.round((netIncome / income) * 100) : 0
    const expenseRate = income > 0 ? Math.round((netIncome / expenses) * 100) : 0
    setSummary({
      income, expenses, netIncome, savingsRate, expenseRate
    })
  }, [])

  // console.log("LOG :", {
  //   dummyTransactions,
  //   trends
  // })

  return (
    <div className="flex-1 space-y-4 md:p-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h2>
        <p className="text-slate-600">Overview of your financial activity</p>
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

      <Overview data={trends} />

      {transactions.length === 0 ? (
        <EmptyPlaceholder />
      ) : (
        <RecentTransactions transactions={transactions} />
      )}
    </div>
  )
}
