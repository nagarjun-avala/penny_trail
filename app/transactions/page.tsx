"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TransactionForm from "@/components/TransactionForm";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@/lib/types";
import { dummyTransactions } from "@/data/dummyTransactions";
import { defaultCategories } from "@/lib/contsants";
import { Pencil, Trash2, X } from "lucide-react";

export default function TransactionsPage() {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: "",
        type: "",
        startDate: "",
        endDate: "",
    });

    const handleEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setSelectedTransaction(undefined);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedTransaction(undefined);
    };

    const clearFilters = () => {
        setFilters({ category: "", type: "", startDate: "", endDate: "" });
    };

    const filteredTransactions = dummyTransactions.filter((t) => {
        const categoryMatch = !filters.category || t.category === filters.category;
        const typeMatch = !filters.type || t.type === filters.type;
        const startDateMatch =
            !filters.startDate || new Date(t.date) >= new Date(filters.startDate);
        const endDateMatch =
            !filters.endDate || new Date(t.date) <= new Date(filters.endDate);
        return categoryMatch && typeMatch && startDateMatch && endDateMatch;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        Transactions
                    </h2>
                    <p className="text-slate-600">Manage your income and expenses</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAdd} className="mt-4 lg:mt-0">
                            <i className="fas fa-plus mr-2"></i>Add Transaction
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedTransaction ? "Edit Transaction" : "Add Transaction"}
                            </DialogTitle>
                        </DialogHeader>
                        <TransactionForm
                            transaction={selectedTransaction}
                            onSuccess={handleDialogClose}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <Label htmlFor="category-filter" className="mb-1">Category</Label>
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
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

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
                                    <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

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

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                        Date
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                        Description
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                        Category
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                        Type
                                    </th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">
                                        Amount
                                    </th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            {formatDate(transaction.date)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            {transaction.description}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Badge variant="secondary">{transaction.category}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm capitalize text-slate-900">
                                            {transaction.type}
                                        </td>
                                        <td
                                            className={`px-6 py-4 text-sm text-right font-semibold ${transaction.type === "income"
                                                ? "text-emerald-600"
                                                : "text-red-600"
                                                }`}
                                        >
                                            {transaction.type === "income" ? "+" : "-"}
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(transaction)}
                                                >
                                                    <Pencil className="text-blue-600" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <Trash2 className="text-red-600" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Delete Transaction
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this
                                                                transaction?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => { }}>
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredTransactions.length === 0 && (
                            <div className="text-center py-12">
                                <i className="fas fa-receipt text-slate-300 text-4xl mb-4"></i>
                                <h3 className="text-lg font-medium text-slate-900 mb-2">
                                    No transactions found
                                </h3>
                                <p className="text-slate-500 mb-4">
                                    Try adjusting your filters or add your first transaction.
                                </p>
                                <Button onClick={handleAdd}>
                                    <i className="fas fa-plus mr-2"></i>Add Transaction
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
