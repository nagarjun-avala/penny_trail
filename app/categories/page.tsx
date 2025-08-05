"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CategoryWithStats, DateFilterValue } from "@/lib/types"
import {
    Plus,
    EllipsisVertical,
} from "lucide-react"
import { fetchCategoriesWithStats, formatCurrency } from "@/lib/utils"
import { dummyTransactions } from "@/data/dummyTransactions"
import { DATE_FILTER_OPTIONS, defaultCategories } from "@/lib/contsants"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import CategoryForm from "@/components/CategoryForm"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import { DateRange } from "react-day-picker";


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
        console.log({ filterRange, filtered })
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
                    <div className="flex items-center space-x-4">
                        <Select value={filterRange} onValueChange={(val) => setFilterRange(val as DateFilterValue)}>

                            <SelectTrigger className="w-[180px] mt-4 lg:mt-0">
                                <SelectValue placeholder="Filter by date" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableFilters.map((filter) => (
                                    <SelectItem key={filter.value} value={filter.value}>
                                        {filter.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {filterRange === "custom" && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="mt-4 lg:mt-0">
                                        {customRange?.from && customRange?.to
                                            ? `${customRange.from.toDateString()} - ${customRange.to.toDateString()}`
                                            : "Pick date range"
                                        }
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="range"
                                        selected={customRange}
                                        onSelect={(range) => setCustomRange(range)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>



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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedCategories.map((category) => (
                    <Card key={category.id}>
                        <CardContent>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${category.color}20` }}
                                    >
                                        {typeof category.icon === "string" ? (
                                            category.icon
                                        ) : category.icon ? (
                                            React.createElement(category.icon, {
                                                className: "text-lg",
                                                style: { color: category.color }
                                            })
                                        ) : null}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{category.name}</h3>
                                        <p className="text-sm text-slate-500">
                                            {category.transactionCount} transaction{category.transactionCount !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <EllipsisVertical className="text-slate-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                                            <i className="fas fa-edit mr-2"></i>
                                            Edit
                                        </DropdownMenuItem>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                    <i className="fas fa-trash mr-2"></i>
                                                    Delete
                                                </DropdownMenuItem>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete this category? This action cannot be undone.
                                                        {category.transactionCount > 0 && (
                                                            <span className="block mt-2 text-red-600 font-medium">
                                                                This category has {category.transactionCount} transaction{category.transactionCount !== 1 ? 's' : ''} and cannot be deleted.
                                                            </span>
                                                        )}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(category.id)}
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-3"> {/* ! Remove space-y-3 if design not good */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Total {category.type === "income" ? "Earned" : "Spent"}</span>
                                    <span className="font-semibold text-slate-900">
                                        {formatCurrency(category.totalAmount)}
                                    </span>
                                </div>

                                {category.transactionCount > 0 && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Avg. per transaction</span>
                                            <span className="font-semibold text-slate-900">
                                                {formatCurrency(category.avgAmount)}
                                            </span>
                                        </div>

                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full"
                                                style={{
                                                    width: `${Math.min(category.percentage, 100)}%`,
                                                    backgroundColor: `${category.color}70`
                                                }}
                                            ></div>
                                        </div>

                                        <p className="text-sm text-slate-500">
                                            {category.percentage.toFixed(1)}% of total {category.type === "income" ? "income" : "expenses"}
                                        </p>
                                    </>
                                )}

                                {category.transactionCount === 0 && (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-slate-500">No transactions yet</p>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.type === "income"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-red-100 text-red-800"
                                        }`}>
                                        {category.type}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* NO categories Add new category */}
                {categories.length === 0 && (
                    <div className="col-span-full">
                        <Card>
                            <CardContent className="p-12 text-center">
                                <i className="fas fa-tags text-slate-300 text-4xl mb-4"></i>
                                <h3 className="text-lg font-medium text-slate-900 mb-2">No categories found</h3>
                                <p className="text-slate-500 mb-4">Get started by creating your first category.</p>
                                <Button onClick={handleAdd}>
                                    <Plus />Add Category
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CategoriesPage
