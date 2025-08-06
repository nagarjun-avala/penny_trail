"use client"

import React, { useEffect, useMemo, useState } from "react"
import { CategoryWithStats, DateFilterValue } from "@/lib/types"
import {
    Plus,
} from "lucide-react"
import { fetchCategoriesWithStats } from "@/lib/utils"
import { dummyTransactions } from "@/data/dummyTransactions"
import { DATE_FILTER_OPTIONS, defaultCategories } from "@/lib/contsants"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import CategoryForm from "@/components/CategoryForm"

import { DateRange } from "react-day-picker";
import CategoryFilter from "./CategoryFilter"
import CategoryList from "./CategoryList"


const CategoriesPage = () => {
    const [categories, setCategories] = useState<CategoryWithStats[]>([])
    const [selectedCategory, setSelectedCategory] = useState<CategoryWithStats | undefined>()
    const [filterRange, setFilterRange] = useState<DateFilterValue>("this_month")
    const [customRange, setCustomRange] = useState<DateRange | undefined>()
    const [, setFilteredTransactions] = useState(dummyTransactions)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const availableFilters = useMemo(() => {
        const now = new Date()
        return DATE_FILTER_OPTIONS.filter((option) => {
            if (option.alwaysShow || option.value === "custom") return true
            return dummyTransactions.some((txn) => {
                const txnDate = new Date(txn.createdAt)
                switch (option.value) {
                    case "last_6_months": {
                        const d = new Date(now)
                        d.setMonth(d.getMonth() - 6)
                        return txnDate >= d
                    }
                    case "last_year": {
                        const d = new Date(now)
                        d.setFullYear(d.getFullYear() - 1)
                        return txnDate >= d
                    }
                    case "last_5_years": {
                        const d = new Date(now)
                        d.setFullYear(d.getFullYear() - 5)
                        return txnDate >= d
                    }
                    case "today":
                        return txnDate.toDateString() === now.toDateString()
                    case "this_week": {
                        const start = new Date(now)
                        start.setDate(now.getDate() - now.getDay())
                        const end = new Date(start)
                        end.setDate(start.getDate() + 6)
                        return txnDate >= start && txnDate <= end
                    }
                    case "all":
                        return true
                    default:
                        return false
                }
            })
        })
    }, [])

    useEffect(() => {

        const now = new Date()
        const filterFns: Record<DateFilterValue, (txnDate: Date) => boolean> = {
            this_month: (d) => d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(),
            last_6_months: (d) => {
                const t = new Date(now)
                t.setMonth(t.getMonth() - 6)
                return d >= t
            },
            last_year: (d) => {
                const t = new Date(now)
                t.setFullYear(t.getFullYear() - 1)
                return d >= t
            },
            last_5_years: (d) => {
                const t = new Date(now)
                t.setFullYear(t.getFullYear() - 5)
                return d >= t
            },
            today: (d) => d.toDateString() === now.toDateString(),
            this_week: (d) => {
                const start = new Date(now)
                start.setDate(now.getDate() - now.getDay())
                const end = new Date(start)
                end.setDate(start.getDate() + 6)
                return d >= start && d <= end
            },
            custom: (d) => !!customRange?.from && !!customRange?.to && d >= customRange.from && d <= customRange.to,
            all: () => true,
        }

        const filtered = dummyTransactions.filter((txn) => {
            const txnDate = new Date(txn.createdAt)
            return filterFns[filterRange](txnDate)
        })
        setFilteredTransactions(filtered)
        setCategories(fetchCategoriesWithStats(filtered, defaultCategories))
    }, [filterRange, customRange])


    const sortedCategories = categories.sort(
        (a, b) => b.percentage - a.percentage
    )

    const handleEdit = (category: CategoryWithStats) => {
        setSelectedCategory(category);
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setSelectedCategory(undefined);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedCategory(undefined);
    };

    const handleDelete = async (id: string) => {
        alert(`Delete this category : ${id}`)
    };

    // console.log({ filteredTransactions, categories, sortedCategories })

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Categories</h2>
                    <p className="text-slate-600">Manage transaction categories and view insights</p>
                </div>
                <div className="flex items-center space-x-4">
                    {/* filter */}
                    <CategoryFilter
                        filterRange={filterRange}
                        customRange={customRange}
                        availableFilters={availableFilters}
                        setFilterRange={setFilterRange}
                        setCustomRange={setCustomRange}
                    />
                    {/* add button */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAdd} className="mt-4 lg:mt-0">
                                <Plus />Add Category
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
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Category Grid */}
            <CategoryList
                categories={sortedCategories}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleAdd={handleAdd}
            />
        </div>
    )
}

export default CategoriesPage
