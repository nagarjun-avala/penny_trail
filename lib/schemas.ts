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
    type: z.enum(["income", "expense"]),
});

// 🔷 Transaction Schema
export const insertTransactionSchema = z.object({
    description: z.string().optional(),
    note: z.string().optional(),
    amount: amountField,
    type: z.enum(["income", "expense"]),
    categoryId: z.string().min(1, "Category is required"),
    createdAt: z.string().min(1, "Date is required"),
    notes: z.string().optional(),
});

// 🔷 User Login Schema
export const loginUserSchema = z.object({
    email: z.email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
// 🔷 User Register Schema
export const registerUserSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});



// Base types
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type LoginInput = z.infer<typeof loginUserSchema>;
export type RegisterInput = z.infer<typeof registerUserSchema>;