import { LucideIcon } from "lucide-react";
import { z } from "zod";

// Common reusable amount validator
const amountField = z
    .coerce
    .number("Amount must be a number")
    .positive("Amount must be a positive number")

// 🔷 Category Schema
export const insertCategorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    icon: z.union([z.string(), z.custom<LucideIcon>()]),
    color: z.string().min(1, "Color is required"),
    type: z.enum(["income", "expenses"]),
});

// 🔷 Transaction Schema
export const insertTransactionSchema = z.object({
    description: z.string().optional(),
    amount: amountField,
    type: z.enum(["income", "expenses"]),
    categoryId: z.string().min(1, "Category is required"),
    createdAt: z.string().min(1, "Date is required"),
    notes: z.string().optional(),
});

// 🔷 Budget Schema
export const insertBudgetSchema = z.object({
    categoryId: z.string().min(1, "Category is required"),
    amount: amountField,
    period: z.enum(["weekly", "monthly", "yearly"]).default("monthly"),
    type: z.enum(["income", "expenses"]),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    isActive: z.boolean().optional(),
});

// 🔷 Goal Schema
export const insertGoalSchema = z.object({
    name: z.string().min(1, "Goal name is required"),
    description: z.string().optional(),
    targetAmount: amountField,
    targetDate: z.string().optional(),
    category: z.enum(["savings", "debt", "purchase"]).default("savings"),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
});

// 🔷 Recurring Transaction Schema
export const insertRecurringTransactionSchema = z.object({
    description: z.string().min(1),
    categoryId: z.string().min(1, "Category is required"),
    type: z.enum(["income", "expenses"]),
    amount: amountField,
    frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    notes: z.string().optional(),

});


// Base types
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type InsertRecurringTransaction = z.infer<typeof insertRecurringTransactionSchema>;