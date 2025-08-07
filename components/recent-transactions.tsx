import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, Transaction } from "@/lib/types";
import { formatCurrency, getLucideIcon, getRelativeDate } from "@/lib/utils";
import React from "react";

function getCategoryMeta(name: string, categories: Category[]) {
    const categoryMap = new Map(categories.map((c) => [c.name, c]));
    const category = categoryMap.get(name);
    return {
        type: category?.type === "income" ? "income" : "expenses",
        icon: category?.icon ?? "💸",
        color: category?.color ?? "#ccc",
    };
}

export const RecentTransactions = React.memo(function RecentTransactions({
    transactions,
}: {
    transactions: Partial<Transaction>[];
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
                    transactions.map((tx) => {
                        if (!tx.category) return null; // or handle fallback
                        const { icon, color, type } = tx.category;
                        const Icon = getLucideIcon(icon);
                        return (
                            <div key={tx.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 flex items-center justify-center rounded-md text-lg"
                                        style={{ backgroundColor: `${color}20`, color }}
                                    >
                                        <Icon />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">
                                            {tx.description}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {tx?.category?.name} •{" "}
                                            {tx.createdAt ? getRelativeDate(tx.createdAt) : "No date"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={
                                            type === "expense" ? "text-red-500" : "text-green-500"
                                        }
                                    >
                                        {formatCurrency(tx.amount || 0)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
});
