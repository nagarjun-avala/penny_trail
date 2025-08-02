import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isToday, isYesterday, differenceInDays, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { currencyService } from "./currency";
import { CATEGORY_COLORS, defaultCategories } from "./contsants";
import { ExpenseCategory, Transaction } from "./types";

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  // Try to use the detected currency format
  const currentCurrency = currencyService.getCachedCurrency();

  if (currentCurrency) {
    return new Intl.NumberFormat(currentCurrency.locale, {
      style: "currency",
      currency: currentCurrency.code,

    }).format(num);
  }

  // Fallback to USD if currency not detected yet
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatDateForInput(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}


export function getRelativeDate(dateStr: string): string {
  const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr

  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"

  const diff = differenceInDays(new Date(), date)

  if (diff < 7) return `${diff} days ago`

  return format(date, "dd MMM yyyy") // Example: 31 Jul 2025
}

export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}


export function getCategoryMeta(categoryName: string) {
  const category = defaultCategories.find(c => c.name === categoryName)
  return {
    icon: category?.icon ?? "💸",
    color: category?.color ?? "#ccc",
    type: category?.type === "income" ? "income" : "expense"
  }
}

export function generateExpenseCategories(transactions: Transaction[]): ExpenseCategory[] {
  const expenses = transactions.filter((t) => t.type === "expenses")

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)

  const categoryMap: Record<string, number> = {}

  for (const tx of expenses) {
    categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount
  }

  return Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
    percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
    color: CATEGORY_COLORS[name] || CATEGORY_COLORS["Others"],
  }))
}

export function generateMonthlyData(trends: Trend[]): MonthlyData[] {
  const monthlyMap = new Map<string, MonthlyData>()

  for (const item of trends) {
    const date = new Date(item.date)
    const key = `${date.getFullYear()}-${date.getMonth()}` // e.g., "2025-6"

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, {
        month: date.toLocaleDateString("en-US", { month: "short" }),
        income: 0,
        expenses: 0,
      })
    }

    const current = monthlyMap.get(key)!
    current.income += item.income
    current.expenses += item.expenses
  }

  // Convert Map to array and sort chronologically
  const sorted = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([_, value]) => value)

  // Return only the last 6 months
  return sorted.slice(-6)
}