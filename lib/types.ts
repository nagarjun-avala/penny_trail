import { JWTPayload } from "jose";
// Authentication Types
export interface SessionPayload extends JWTPayload {
    id: string;
    email: string;
};

// Base types
export type Category = {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: "income" | "expense"; // enforce union;
    createdAt: string;
};

export type Transaction = {
    id: string;
    description: string;
    note?: string;
    category: Category;
    categoryId: string;
    amount: number;
    type: "income" | "expense";
    createdAt: string;
};

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
    net: number;
}

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


export type DateFilterValue =
    | "this_month"
    | "last_6_months"
    | "last_year"
    | "last_5_years"
    | "today"
    | "this_week"
    | "custom"
    | "all";
