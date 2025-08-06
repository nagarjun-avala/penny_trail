import React, { Dispatch, SetStateAction } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultCategories } from "@/lib/contsants";
import { X } from "lucide-react";
import { Button } from '@/components/ui/button';

type Filter = {
    category: string
    type: string
    startDate: string
    endDate: string
}

type Props = {
    filters: Filter
    setFilters: Dispatch<SetStateAction<Filter>>
}

const TransactionsFilter = ({ filters, setFilters }: Props) => {
    const clearFilters = () => {
        setFilters({ category: "", type: "", startDate: "", endDate: "" });
    };
    return (
        <Card>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Category Type Filter */}
                    <div>
                        <Label htmlFor="category-filter" className="mb-2">Category</Label>
                        <Select
                            value={filters.category}
                            onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, category: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {defaultCategories
                                    .filter((cat) => cat.id && cat.id.trim() !== "")
                                    .map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            <div
                                                className="w-9 h-9 flex items-center justify-center rounded-md text-lg"
                                                style={{ backgroundColor: `${category.color}20`, color: category.color }}
                                            >
                                                {typeof category.icon === "string" ? (
                                                    category.icon
                                                ) : category.icon ? (
                                                    React.createElement(category.icon)
                                                ) : null}
                                            </div>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Transactiom (income | expenses ) Type Filter */}
                    <div>
                        <Label htmlFor="type-filter" className="mb-1">Type</Label>
                        <Select
                            value={filters.type}
                            onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, type: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expenses">Expenses</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* From Date Type Filter */}
                    <div>
                        <Label htmlFor="start-date" className="mb-1">From Date</Label>
                        <Input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                            }
                        />
                    </div>

                    {/* To Date Type Filter */}
                    <div>
                        <Label htmlFor="end-date" className="mb-1">To Date</Label>
                        <Input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                            }
                        />
                    </div>
                </div>
                {(filters.category ||
                    filters.type ||
                    filters.startDate ||
                    filters.endDate) && (
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                            <X className="mr-2" /> Clear Filters
                        </Button>
                    )}
            </CardContent>
        </Card>
    )
}

export default TransactionsFilter