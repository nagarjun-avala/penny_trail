import { ArrowLeftRightIcon, BriefcaseBusinessIcon, BusFrontIcon, ChartLineIcon, ChartNoAxesCombinedIcon, CirclePlusIcon, ClapperboardIcon, GraduationCapIcon, HeartPulseIcon, LaptopIcon, ReceiptTextIcon, ShoppingBagIcon, TagsIcon, TicketsPlaneIcon, UtensilsIcon } from "lucide-react";
import { Category } from "./types";

export const navigation = [
    { name: "Dashboard", href: "/", icon: ChartLineIcon },
    { name: "Transactions", href: "/transactions", icon: ArrowLeftRightIcon },
    { name: "Analytics", href: "/analytics", icon: ChartNoAxesCombinedIcon },
    { name: "Categories", href: "/categories", icon: TagsIcon },
];

export const TRANSACTION_TYPES = {
    INCOME: "income",
    EXPENSE: "expenses",
} as const;

export const COPY_CATEGORY_COLORS = [
    "#F97316", // orange
    "#3B82F6", // blue
    "#8B5CF6", // purple
    "#EF4444", // red
    "#10B981", // emerald
    "#EC4899", // pink
    "#F59E0B", // amber
    "#6B7280", // gray
] as const;


export const CHART_COLORS = {
    income: "#10B981",
    expenses: "#EF4444",
    primary: "#0ea5e9",
    secondary: "#64748b",
};

export const defaultCategories: Category[] = [
    {
        id: "b7e9c32c-9119-47d2-a3b1-95fcd6ff1e20",
        name: "Food",
        icon: UtensilsIcon,
        color: "#F97316",
        type: "expenses",
        createdAt: "2025-07-31T19:09:52.481153"
    },
    {
        id: "aa92c899-d2f3-4f9a-b741-0bb95e38cc2c",
        name: "Transportation",
        icon: BusFrontIcon,
        color: "#3B82F6",
        type: "expenses",
        createdAt: "2025-07-31T19:09:52.481156"
    },
    {
        id: "07a60b12-c3d1-4b27-93c3-4e103416df8f",
        name: "Entertainment",
        icon: ClapperboardIcon,
        color: "#8B5CF6",
        type: "expenses",
        createdAt: "2025-07-31T19:09:52.481157"
    },
    {
        id: "3936152c-5b2e-42cd-8c10-39f20cb5cf78",
        name: "Healthcare",
        icon: HeartPulseIcon,
        color: "#EF4444",
        type: "expenses",
        createdAt: "2025-07-31T19:09:52.481158"
    },
    {
        id: "19a3b07a-0893-4aa3-9144-e6dc4bb10d37",
        name: "Shopping",
        icon: ShoppingBagIcon,
        color: "#F59E0B",
        type: "expenses",
        createdAt: "2025-07-31T19:09:52.481159"
    },
    {
        id: "49347816-e50d-4aa2-bd0c-7ec0ef56c3e5",
        name: "Bills",
        icon: ReceiptTextIcon,
        color: "#6B7280",
        type: "expenses",
        createdAt: "2025-07-31T19:09:52.481160"
    },
    {
        id: "4a7b2b98-59d3-4621-aef3-3fa255e9ce33",
        name: "Education",
        icon: GraduationCapIcon,
        color: "#10B981",
        type: "expenses",
        createdAt: "2025-07-31T19:09:52.481161"
    },
    {
        id: "70a1f60d-66d3-4290-b949-f5eb847d8e65",
        name: "Travel",
        icon: TicketsPlaneIcon,
        color: "#06B6D4",
        type: "expenses",
        createdAt: "2025-07-31T19:09:52.481162"
    },
    {
        id: "f3d98940-6711-4e03-a303-d54496ec6fe0",
        name: "Salary",
        icon: BriefcaseBusinessIcon,
        color: "#10B981",
        type: "income",
        createdAt: "2025-07-31T19:09:52.481163"
    },
    {
        id: "a014e64e-f34c-45b3-b417-2c263c14f7d4",
        name: "Freelance",
        icon: LaptopIcon,
        color: "#3B82F6",
        type: "income",
        createdAt: "2025-07-31T19:09:52.481164"
    },
    {
        id: "336d4d64-bf3a-41e7-9f79-724d3f7b16e4",
        name: "Investment",
        icon: ChartLineIcon,
        color: "#8B5CF6",
        type: "income",
        createdAt: "2025-07-31T19:09:52.481165"
    },
    {
        id: "6255530d-faaa-4ad2-82eb-5a0ae01d536b",
        name: "Groceries",
        icon: "🛒",
        color: "#ef4444",
        type: "expenses",
        createdAt: "2025-07-31T19:09:52.481166"
    },
    {
        id: "1a19a169-24e5-4e86-86c4-5a5f3e79c349",
        name: "Other Income",
        icon: CirclePlusIcon,
        color: "#F59E0B",
        type: "income",
        createdAt: "2025-07-31T19:09:52.481167"
    }
];

export const DATE_FILTER_OPTIONS = [
    { label: "This Month", value: "this_month", alwaysShow: true },
    { label: "Last 6 Months", value: "last_6_months" },
    { label: "Last Year", value: "last_year" },
    { label: "Last 5 Years", value: "last_5_years" },
    { label: "All Time", value: "all" },
    { label: "Today", value: "today", alwaysShow: true },
    { label: "This Week", value: "this_week", alwaysShow: true },
    { label: "Custom Range", value: "custom", alwaysShow: true },
];
