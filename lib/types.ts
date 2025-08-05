import { LucideIcon } from "lucide-react";

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
    type: "income" | "expenses";
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

// ! remove TrendData type (Trend and TrendData are almost same:- net: number [Add it to Trend])
export type Trend = {
    date: string
    income: number
    expenses: number
}

export type TrendData = {
    date: string;
    income: number;
    expenses: number;
    net: number;
};

export type MonthlyData = {
    month: string
    income: number
    expenses: number
}

// Extended types for API responses
export type TransactionWithCategory = Transaction & {
    category: Category;
};

export type CategoryWithStats = Category & {
    transactionCount: number;
    totalAmount: string;
    avgAmount: string;
    percentage: number;
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


export type DateFilterValue =
    | "this_month"
    | "last_6_months"
    | "last_year"
    | "last_5_years"
    | "today"
    | "this_week"
    | "custom"
    | "all";
