"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";


import TransactionForm from "@/components/TransactionForm";
import { Transaction } from "@/lib/types";
import { dummyTransactions } from "@/data/dummyTransactions";
import TransactionsList from "./components/TransactionsList";
import TransactionsFilter from "./components/TransactionsFilter";
import { Plus } from "lucide-react";


export default function TransactionsPage() {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: "",
        type: "",
        startDate: "",
        endDate: "",
    });


    const handleAdd = () => {
        setSelectedTransaction(undefined);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedTransaction(undefined);
    };

    const filteredTransactions = dummyTransactions.filter((t) => {
        const categoryMatch = !filters.category || t.category === filters.category;
        const typeMatch = !filters.type || t.type === filters.type;
        const startDateMatch =
            !filters.startDate || new Date(t.createdAt) >= new Date(filters.startDate);
        const endDateMatch =
            !filters.endDate || new Date(t.createdAt) <= new Date(filters.endDate);
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
                            <Plus className="mr-2" />Add Transaction
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

            <TransactionsFilter
                filters={filters}
                setFilters={setFilters}
            />

            <TransactionsList
                setIsDialogOpen={setIsDialogOpen}
                transactions={filteredTransactions}
                setSelectedTransaction={setSelectedTransaction}
            />
        </div>
    );
}
