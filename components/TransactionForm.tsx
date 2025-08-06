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
import { getLucideIcon } from "@/lib/utils";
import React, { useState } from "react";
import { Category, Transaction } from "@/lib/types";
import { insertTransactionSchema } from "@/lib/schemas";
import { toast } from "sonner";
import z from "zod";
import { createTrasaction } from "@/lib/fetch";


interface TransactionFormProps {
    transaction?: Transaction;
    categories: Category[]
    onSuccess?: () => void;
}


export default function TransactionForm({ transaction, categories, onSuccess }: TransactionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState("expense");

    const form = useForm({
        resolver: zodResolver(insertTransactionSchema),
        defaultValues: {
            description: transaction?.description || "",
            note: transaction?.note || "",
            amount: transaction?.amount || 0, // number (because schema coerces)
            type: transaction?.type || "expense",
            categoryId: transaction?.categoryId || "",
        },
    });
    const onSubmit = async (data: z.infer<typeof insertTransactionSchema>) => {
        setIsSubmitting(true);
        const res = await createTrasaction(data)
        console.log(res)
        toast.success("Success", {
            description: transaction ? "Transaction updated" : "Transaction created",
        });

        form.reset();
        onSuccess?.();
        setIsSubmitting(false);
    };

    return (
        <Form {...form}>
            <form className="space-y-4">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={(e) => {
                                        field.onChange(e)
                                        setSelectedType(e)
                                    }}
                                    defaultValue={field.value}
                                    className="flex space-x-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="income" id="income" />
                                        <Label htmlFor="income">Income</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="expense" id="expense" />
                                        <Label htmlFor="expense">Expense</Label>
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
                                    {categories.filter(cat => cat.type === selectedType).map((category) => {
                                        const Icon = getLucideIcon(category.icon);
                                        return <SelectItem
                                            key={category.id}
                                            value={category.id}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="w-9 h-9 flex items-center justify-center rounded-md text-lg"
                                                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                                                >
                                                    <Icon />
                                                </div>
                                                <span>{category.name}</span>
                                            </div>
                                        </SelectItem>
                                    })}

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
                <div className="flex space-x-3 pt-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => onSuccess?.()}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={isSubmitting}
                        onClick={form.handleSubmit(onSubmit)}
                    >
                        {isSubmitting ? "Saving..." : transaction ? "Update Transaction" : "Add Transaction"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
