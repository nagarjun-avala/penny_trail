import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Category } from "@/lib/types";
import { InsertCategory, insertCategorySchema } from "@/lib/schemas";
import { defaultCategories } from "@/lib/contsants";
import React from "react";

interface CategoryFormProps {
    category?: Category;
    onSuccess?: () => void;
}

export default function CategoryForm({ category, onSuccess }: CategoryFormProps) {

    const form = useForm<InsertCategory>({
        resolver: zodResolver(insertCategorySchema),
        defaultValues: {
            name: category?.name || "",
            icon: category?.icon || "",
            color: category?.color || defaultCategories[0].color,
            type: category?.type || "expenses",
        },
    });

    console.log({ values: form.formState.defaultValues })


    const onSubmit = (data: InsertCategory) => {
        console.log(data)
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Category name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                    name="icon"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Icon</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select icon" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="py-2">
                                    {defaultCategories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            <div className="flex items-center space-x-2">
                                                {typeof cat.icon === "string" ? (
                                                    <span>{cat.icon}</span>
                                                ) : cat.icon ? (
                                                    React.createElement(cat.icon)
                                                ) : null}
                                                <span className="capitalize">{cat.name}</span>
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
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                                <div className="flex flex-wrap gap-2">
                                    {defaultCategories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            className={`w-8 h-8 rounded-full border-2 ${field.value === cat.color ? "border-gray-900" : "border-gray-300"
                                                }`}
                                            style={{ backgroundColor: cat.color }}
                                            onClick={() => field.onChange(cat.color)}
                                        />
                                    ))}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => onSuccess?.()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                    >
                        Add Category
                    </Button>
                </div>
            </form>
        </Form>
    );
}
