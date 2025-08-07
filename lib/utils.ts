import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isToday, isYesterday, differenceInDays, parseISO } from "date-fns"
import { currencyService } from "./currency";
import { defaultCategories } from "./contsants";
import { Category, CategoryWithStats, ExpenseCategory, MonthlyData, Transaction, Trend } from "./types";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export function getRelativeDate(dateStr: string): string {
  const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr

  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"

  const diff = differenceInDays(new Date(), date)

  if (diff < 7) return `${diff} days ago`

  return format(date, "dd MMM yyyy") // Example: 31 Jul 2025
}

/**
 * Maps a string name (like "ShoppingCart") to a LucideIcon component.
 *
 * @param iconName - The name of the icon to look up.
 * @returns A LucideIcon component or fallback.
 */
export function getLucideIcon(iconName: string): LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  const icon = icons[iconName];

  if (process.env.NODE_ENV === "development" && !icon) {
    console.warn(`⚠️ Unknown Lucide icon: "${iconName}" — using fallback.`);
    return LucideIcons.ShoppingCartIcon;
  }

  return icon;
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
  const expenses = transactions.filter((t) => t.type === "expense")

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)

  const categoryMap: Record<string, number> = {}

  for (const tx of expenses) {
    categoryMap[tx.categoryId] = (categoryMap[tx.categoryId] || 0) + tx.amount
  }

  return Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
    percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
    color: defaultCategories.find(cat => cat.name === name)?.color ??
      defaultCategories[defaultCategories.length - 1].color,
  }))
}

export function generateMonthlyData(trends: Partial<Trend>[]): MonthlyData[] {
  const monthlyMap = new Map<string, MonthlyData>()

  for (const item of trends) {
    const date = new Date(item.date ?? Date.now()); // ✅ Safe fallback
    const key = `${date.getFullYear()}-${date.getMonth()}` // e.g., "2025-6"

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, {
        month: date.toLocaleDateString("en-US", { month: "short" }),
        income: 0,
        expenses: 0,
      })
    }

    const current = monthlyMap.get(key)!
    current.income += item.income ?? 0
    current.expenses += item.expenses ?? 0
  }

  // Convert Map to array and sort chronologically
  const sorted = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([, value]) => value)

  // Return only the last 6 months
  return sorted.slice(-6)
}

export function fetchCategoriesWithStats(
  transactions: Transaction[],
  categories: Category[]
): CategoryWithStats[] {
  // Step 1: Build stats for each category
  const categoriesWithStats: CategoryWithStats[] = categories.map((category) => {
    const relevantTxns = transactions.filter(
      (txn) => txn.categoryId === category.id && txn.type === category.type
    );

    const transactionCount = relevantTxns.length;
    const totalAmount = relevantTxns.reduce((sum, txn) => sum + txn.amount, 0);
    const avgAmount = transactionCount > 0 ? totalAmount / transactionCount : 0;

    return {
      ...category,
      transactionCount,
      totalAmount: totalAmount.toFixed(2),
      avgAmount: avgAmount.toFixed(2),
      percentage: 0, // frontend will compute it next
    };
  });

  // Step 2: Calculate percentage contribution for each category
  const totalExpenses = categoriesWithStats.reduce(
    (sum, cat) => sum + parseFloat(cat.totalAmount),
    0
  );

  return categoriesWithStats.map((cat) => ({
    ...cat,
    percentage:
      totalExpenses > 0
        ? (parseFloat(cat.totalAmount) / totalExpenses) * 100
        : 0,
  }));
}

/**
 * Returns the initials from a full name.
 *
 * @param name - Full name as a string (e.g., "Arun Kumar")
 * @returns Initials in uppercase (e.g., "AK")
 */
export const getInitials = (name: string): string => {
  return name
    // Split the name by spaces to get each word
    .split(' ')
    // Filter out any empty strings (in case of extra spaces)
    .filter(Boolean)
    // Take the first character of each word and convert to uppercase
    .map((word) => word[0].toUpperCase())
    // Combine all initials into a single string
    .join('');
};

