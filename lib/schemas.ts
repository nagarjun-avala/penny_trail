import { z } from "zod";

export const insertCategorySchema = z.object({
    name: z.string().min(1),
    icon: z.string().default("fas fa-tag"),
    color: z.string().default("#6B7280"),
    type: z.enum(["income", "expense"]).default("expense"),
});


export const insertTransactionSchema = z.object({
    description: z.string().min(1, "Description is required"),
    amount: z.coerce
        .number("Amount must be a number")
        .positive("Amount must be a positive number"),
    type: z.enum(["income", "expense"]),
    categoryId: z.string().min(1, "Category is required"),
    date: z.string().min(1, "Date is required"),
});


export const insertBudgetSchema = z.object({
    categoryId: z.string().min(1),
    amount: z.string().min(1).refine(
        val => !isNaN(Number(val)) && Number(val) > 0,
        "Amount must be a positive number"
    ),
    period: z.enum(["weekly", "monthly", "yearly"]).default("monthly"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    isActive: z.boolean().optional(),
});

export const insertGoalSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    targetAmount: z.string().min(1).refine(
        val => !isNaN(Number(val)) && Number(val) > 0,
        "Target amount must be a positive number"
    ),
    targetDate: z.string().optional(),
    category: z.enum(["savings", "debt", "purchase"]).default("savings"),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const insertRecurringTransactionSchema = z.object({
    description: z.string().min(1),
    amount: z.string().min(1).refine(
        val => !isNaN(Number(val)) && Number(val) > 0,
        "Amount must be a positive number"
    ),
    type: z.enum(["income", "expense"]),
    categoryId: z.string().min(1),
    frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
});
