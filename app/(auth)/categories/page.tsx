"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import CategoryForm from "@/components/CategoryForm";
import CategoryFilter from "./CategoryFilter";
import CategoryList from "./CategoryList";
import { CategoryWithStats, DateFilterValue, Transaction, Category } from "@/lib/types";
import { DATE_FILTER_OPTIONS } from "@/lib/contsants";
import { fetchCategoriesWithStats } from "@/lib/utils";
import { deleteCategory, getCategories, getTrasactions } from "@/lib/controllers";
import { toast } from "sonner";

const CategoriesPage = () => {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<CategoryWithStats[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryWithStats | undefined>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filterRange, setFilterRange] = useState<DateFilterValue>("this_month");
    const [customRange, setCustomRange] = useState<DateRange>();

    const now = useMemo(() => new Date(), []);

    /** 🧠 Fetch transactions & categories once */
    const fetchData = useCallback(async () => {
        setLoading(true); // ✅ Always reset to true before fetch
        try {
            const [categories, trasactions] = await Promise.all([
                getCategories(),
                getTrasactions(),
            ]);
            setTransactions(trasactions);
            setCategories(categories);
        } catch (error) {
            console.error("❌ Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // 🔄 Fetch data on mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /** 📆 Filter logic */
    const filteredTransactions = useMemo(() => {
        const filters: Record<DateFilterValue, (d: Date) => boolean> = {
            this_month: (d) => d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(),
            last_6_months: (d) => {
                const cutoff = new Date(now);
                cutoff.setMonth(cutoff.getMonth() - 6);
                return d >= cutoff;
            },
            last_year: (d) => {
                const cutoff = new Date(now);
                cutoff.setFullYear(cutoff.getFullYear() - 1);
                return d >= cutoff;
            },
            last_5_years: (d) => {
                const cutoff = new Date(now);
                cutoff.setFullYear(cutoff.getFullYear() - 5);
                return d >= cutoff;
            },
            today: (d) => d.toDateString() === now.toDateString(),
            this_week: (d) => {
                const start = new Date(now);
                start.setDate(now.getDate() - now.getDay());
                const end = new Date(start);
                end.setDate(start.getDate() + 6);
                return d >= start && d <= end;
            },
            custom: (d) =>
                !!customRange?.from &&
                !!customRange?.to &&
                d >= new Date(customRange.from) &&
                d <= new Date(customRange.to),
            all: () => true,
        };

        return transactions.filter((txn) => filters[filterRange](new Date(txn.createdAt)));
    }, [transactions, filterRange, customRange, now]);

    /** 🚀 Update filtered categories when transactions or categories change */
    useEffect(() => {
        const updated = fetchCategoriesWithStats(filteredTransactions, categories);
        setFilteredCategories(updated);
    }, [filteredTransactions, categories]);

    /** 🧠 Filter options based on existing txn dates */
    const availableFilters = useMemo(() => {
        return DATE_FILTER_OPTIONS.filter((option) => {
            if (option.alwaysShow || option.value === "custom") return true;
            return transactions.some((txn) => {
                const d = new Date(txn.createdAt);
                switch (option.value) {
                    case "last_6_months":
                        const d1 = new Date(now);
                        d1.setMonth(d1.getMonth() - 6);
                        return d >= d1;
                    case "last_year":
                        const d2 = new Date(now);
                        d2.setFullYear(d2.getFullYear() - 1);
                        return d >= d2;
                    case "last_5_years":
                        const d3 = new Date(now);
                        d3.setFullYear(d3.getFullYear() - 5);
                        return d >= d3;
                    case "today":
                        return d.toDateString() === now.toDateString();
                    case "this_week":
                        const start = new Date(now);
                        start.setDate(now.getDate() - now.getDay());
                        const end = new Date(start);
                        end.setDate(start.getDate() + 6);
                        return d >= start && d <= end;
                    case "all":
                        return true;
                    default:
                        return false;
                }
            });
        });
    }, [transactions, now]);

    /** ✅ Dialog logic */
    const handleAdd = useCallback(() => {
        setSelectedCategory(undefined);
        setIsDialogOpen(true);
    }, []);

    const handleEdit = useCallback((category: CategoryWithStats) => {
        setSelectedCategory(category);
        setIsDialogOpen(true);
    }, []);

    const handleDialogClose = useCallback(() => {
        setSelectedCategory(undefined);
        setIsDialogOpen(false);
    }, []);

    /** ❌ Delete category stub */
    const handleDelete = async (id: string) => {
        try {
            const res = await deleteCategory(id)
            if (res) toast.success("Category deleted sucessfully")
            fetchData()
        } catch (error) {
            toast.error(String(error))
        }
    };

    /** 📦 Handle new category addition optimistically or update exsisting one */
    const handleUpsertCategory = useCallback((updated: Category) => {
        setCategories(prev => {
            const exists = prev.find(cat => cat.id === updated.id);
            if (exists) {
                // 🔁 Replace existing category
                return prev.map(cat => cat.id === updated.id ? updated : cat);
            }
            // ➕ Add new one
            return [...prev, updated];
        });

        handleDialogClose();
    }, [handleDialogClose]);


    /** 🎯 Sort by percentage spent */
    const sortedCategories = useMemo(
        () => [...filteredCategories].sort((a, b) => b.percentage - a.percentage),
        [filteredCategories]
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Categories</h2>
                    <p className="text-slate-600">Manage your transaction categories and view insights</p>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Filter */}
                    <CategoryFilter
                        filterRange={filterRange}
                        customRange={customRange}
                        availableFilters={availableFilters}
                        setFilterRange={setFilterRange}
                        setCustomRange={setCustomRange}
                    />

                    {/* Add Button + Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAdd} className="mt-4 lg:mt-0">
                                <Plus className="mr-2" /> Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    {selectedCategory ? "Edit Category" : "Add Category"}
                                </DialogTitle>
                            </DialogHeader>
                            <CategoryForm
                                category={selectedCategory}
                                onSuccess={handleDialogClose}
                                onSave={handleUpsertCategory}

                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Grid */}
            <CategoryList
                loading={loading}
                categories={sortedCategories}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleAdd={handleAdd}
            />
        </div>
    );
};

export default CategoriesPage;
