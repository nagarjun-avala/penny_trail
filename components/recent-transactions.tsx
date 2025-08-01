import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { defaultCategories } from "@/lib/contsants"
import { formatCurrency, getRelativeDate } from "@/lib/utils"
import React from "react"

interface Transaction {
    id: string
    description: string
    category: string
    amount: number
    date: string
}

const categoryMap = new Map(defaultCategories.map(c => [c.name, c]))

function getCategoryMeta(name: string) {
    const category = categoryMap.get(name)
    return {
        type: category?.type === "income" ? "income" : "expense",
        icon: category?.icon ?? "💸",
        color: category?.color ?? "#ccc"
    }
}

export const RecentTransactions = React.memo(function RecentTransactions({
    transactions
}: {
    transactions: Partial<Transaction>[]
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {transactions.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        No transactions to display.
                    </div>
                ) : (
                    transactions.map(tx => {
                        const { icon, color, type } = getCategoryMeta(tx.category || "")
                        return (
                            <div key={tx.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 flex items-center justify-center rounded-md text-lg"
                                        style={{ backgroundColor: `${color}20`, color }}
                                    >
                                        {typeof icon === "string" ? icon : React.createElement(icon)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{tx.description}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {tx.category} • {tx.date ? getRelativeDate(tx.date) : "No date"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={type === "expense" ? "text-red-500" : "text-green-500"}>
                                        {formatCurrency(tx.amount || 0)}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
            </CardContent>
        </Card>
    )
})
