"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import TransactionForm from "@/components/TransactionForm";
import { Category, Transaction } from "@/lib/types";
import TransactionsList from "./components/TransactionsList";
import TransactionsFilter from "./components/TransactionsFilter";
import { Plus } from "lucide-react";
import { getCategories, getTrasactions } from "@/lib/fetch";

export default function TransactionsPage() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        categoryId: "",
        type: "",
        startDate: "",
        endDate: "",
    });

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

    const handleTransactionSave = useCallback((newTx: Transaction) => {
        setTransactions((prev) => {
            const exists = prev.find((t) => t.id === newTx.id);
            if (exists) {
                // 🛠️ Edit mode: replace
                return prev.map((t) => (t.id === newTx.id ? newTx : t));
            }
            // ➕ Add mode: append
            return [newTx, ...prev];
        });
    }, []);



    // ➕ Add button handler
    const handleAdd = useCallback(() => {
        setSelectedTransaction(undefined);
        setIsDialogOpen(true);
    }, []);

    const handleDialogClose = useCallback(() => {
        setSelectedTransaction(undefined);
        setIsDialogOpen(false);
        fetchData(); // 🚀 Refresh the data
    }, [fetchData]);

    // 🧠 Memoized filtered transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) => {
            const categoryMatch = !filters.categoryId || t.category.id === filters.categoryId;
            const typeMatch = !filters.type || t.type === filters.type;
            const startDateMatch =
                !filters.startDate || new Date(t.createdAt) >= new Date(filters.startDate);
            const endDateMatch =
                !filters.endDate || new Date(t.createdAt) <= new Date(filters.endDate);
            return categoryMatch && typeMatch && startDateMatch && endDateMatch;
        });
    }, [transactions, filters]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Transactions</h2>
                    <p className="text-slate-600">Manage your income and expenses</p>
                </div>

                {/* Add Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAdd} className="mt-4 lg:mt-0">
                            <Plus className="mr-2" /> Add Transaction
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedTransaction ? "Edit Transaction" : "Add Transaction"}
                            </DialogTitle>
                            <DialogDescription>
                                {selectedTransaction
                                    ? "Edit the selected transaction details"
                                    : "Add a new transaction you made recently"}
                            </DialogDescription>
                        </DialogHeader>

                        <TransactionForm
                            transaction={selectedTransaction}
                            categories={categories}
                            onSuccess={handleDialogClose}
                            onSave={handleTransactionSave} // 🧠 add this
                        />

                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <TransactionsFilter
                filters={filters}
                categories={categories}
                setFilters={setFilters}
            />

            {/* List or Loader */}
            <TransactionsList
                loading={loading}
                transactions={filteredTransactions}
                setIsDialogOpen={setIsDialogOpen}
                setSelectedTransaction={setSelectedTransaction}
            />
        </div>
    );
}
