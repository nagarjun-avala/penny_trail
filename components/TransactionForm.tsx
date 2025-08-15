"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";

import { insertTransactionSchema } from "@/lib/schemas";
import { getLucideIcon } from "@/lib/utils";
import { Category, Transaction } from "@/lib/types";

import {
    Form, FormField, FormItem, FormLabel,
    FormControl, FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    RadioGroup, RadioGroupItem,
} from "@/components/ui/radio-group";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { createOrUpdateTransaction } from "@/lib/controllers";

interface TransactionFormProps {
    transaction?: Transaction;
    categories: Category[];
    onSuccess?: () => void;
    onSave?: (newTx: Transaction) => void; // 🧠 new prop
}


export default function TransactionForm({
    transaction,
    categories,
    onSuccess,
    onSave,
}: TransactionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState(transaction?.type || "expense");

    const form = useForm({
        resolver: zodResolver(insertTransactionSchema),
        defaultValues: {
            id: transaction?.id || "",
            description: transaction?.description || "",
            note: transaction?.note || "",
            amount: transaction?.amount || 0, // number (because schema coerces)
            type: transaction?.type || "expense",
            categoryId: transaction?.categoryId || "",
        },
    });

    const onSubmit = async (data: z.infer<typeof insertTransactionSchema>) => {
        setIsSubmitting(true);
        try {
            const saved = await createOrUpdateTransaction({ ...data, }); // handle both create and update
            toast.success(transaction ? "Trantransaction updated!" : "Trantransaction created!");
            form.reset();
            onSave?.(saved); // pass the new/updated transaction back
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Type Selector */}
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={(e) => {
                                            field.onChange(e);
                                            setSelectedType(e as "income" | "expense");
                                        }}
                                        defaultValue={field.value}
                                        className="flex space-x-4"
                                    >
                                        {["income", "expense"].map((value) => (
                                            <div key={value} className="flex flex-col space-y-1 sm:space-x-4 sm:flex-row"
                                            >
                                                <RadioGroupItem value={value} id={value} />
                                                <Label htmlFor={value}>{value[0].toUpperCase() + value.slice(1)}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Category */}
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
                                    <SelectContent className="flex flex-col space-y-1 sm:space-x-4 sm:flex-row"
                                    >
                                        {categories
                                            .filter((cat) => cat.type === selectedType)
                                            .map((cat) => {
                                                const Icon = getLucideIcon(cat.icon);
                                                return (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        <div className="flex items-center space-x-2">
                                                            <div
                                                                className="w-9 h-9 flex items-center justify-center rounded-md text-lg"
                                                                style={{
                                                                    backgroundColor: `${cat.color}20`,
                                                                    color: cat.color,
                                                                }}
                                                            >
                                                                <Icon />
                                                            </div>
                                                            <span>{cat?.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {/* Description */}
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

                {/* Amount */}
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

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={onSuccess}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Saving..."
                            : transaction
                                ? "Update Transaction"
                                : "Add Transaction"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
