import { LucideIcon } from "lucide-react";

export type TrendData = {
    date: string;
    income: number;
    expenses: number;
    net: number;
};

// Extended types
export type TransactionWithCategory = Transaction & {
    category: Category;
};

// Base types
export type Category = {
    id: string;
    name: string;
    icon?: string | LucideIcon;
    color: string;
    type: "income" | "expenses"; // enforce union;
    createdAt: string;
};

export type Transaction = {
    id: string;
    description: string;
    category: string;
    categoryId: string;
    amount: number;
    date: string; // YYYY-MM-DD
    type: "income" | "expenses";
    createdAt: string;
};


export type Budget = {
    id: string;
    categoryId: string;
    amount: string;
    period: "weekly" | "monthly" | "yearly";
    startDate: string;
    endDate?: string;
    isActive: boolean;
    createdAt: string;
};

export type Goal = {
    id: string;
    name: string;
    description?: string;
    targetAmount: string;
    currentAmount: string;
    targetDate?: string;
    category: "savings" | "debt" | "purchase";
    priority: "low" | "medium" | "high";
    isCompleted: boolean;
    createdAt: string;
};

export type RecurringTransaction = {
    id: string;
    description: string;
    amount: string;
    type: "income" | "expenses";
    categoryId: string;
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    startDate: string;
    endDate?: string;
    lastProcessed?: string;
    isActive: boolean;
    createdAt: string;
};



export type CategoryWithStats = Category & {
    transactionCount: number;
    totalAmount: string;
    avgAmount: string;
    percentage: number;
};

export type BudgetWithCategory = Budget & {
    category: Category;
    spent: string;
    remaining: string;
    percentageUsed: number;
};

export type RecurringTransactionWithCategory = RecurringTransaction & {
    category: Category;
};

export type GoalWithProgress = Goal & {
    progressPercentage: number;
    remainingAmount: string;
    daysRemaining?: number;
    monthlyTarget?: string;
};

export type trasanctionSummayType = {
    income: number
    expenses: number
    netIncome: number
    savingsRate: number
    expenseRate: number
}

export type ExpenseCategory = {
    name: string
    value: number
    percentage: number
    color: string
}

export type Trend = {
    date: string
    income: number
    expenses: number
}

export type MonthlyData = {
    month: string
    income: number
    expenses: number
}