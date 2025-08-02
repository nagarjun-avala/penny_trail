"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { formatDateForInput } from "@/lib/utils";
import React, { useState } from "react";
import { Transaction } from "@/lib/types";
import { insertTransactionSchema } from "@/lib/schemas";
import { defaultCategories } from "@/lib/contsants";
import { toast } from "sonner";
import z from "zod";


interface TransactionFormProps {
    transaction?: Transaction;
    onSuccess?: () => void;
}


export default function TransactionForm({ transaction, onSuccess }: TransactionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(insertTransactionSchema),
        defaultValues: {
            description: transaction?.description || "",
            amount: transaction?.amount || 0, // number (because schema coerces)
            type: transaction?.type || "expenses",
            categoryId: transaction?.categoryId || "",
            date: transaction
                ? formatDateForInput(transaction.date)
                : formatDateForInput(new Date()),
        },
    });




    const selectedType = form.watch("type");

    const filteredCategories = defaultCategories.filter(cat => cat.type === selectedType);

    const onSubmit = async (data: z.infer<typeof insertTransactionSchema>) => {
        setIsSubmitting(true);
        await new Promise((res) => setTimeout(res, 1000)); // Simulate network delay
        console.log(data)
        toast.success("Success", {
            description: transaction ? "Transaction updated" : "Transaction created",
        });

        form.reset();
        onSuccess?.();
        setIsSubmitting(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="income" id="income" />
                                        <Label htmlFor="income">Income</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="expenses" id="expenses" />
                                        <Label htmlFor="expenses">Expenses</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {filteredCategories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            <div className="flex items-center space-x-2">
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
                                                <span>{category.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    value={field.value as number | string}
                                />

                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex space-x-3 pt-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => onSuccess?.()}>
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : transaction ? "Update Transaction" : "Add Transaction"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
