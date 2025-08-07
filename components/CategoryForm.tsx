"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Category } from "@/lib/types";
import { InsertCategory, insertCategorySchema } from "@/lib/schemas";
import { CATEGORY_COLORS, defaultCategories } from "@/lib/contsants";
import { getLucideIcon } from "@/lib/utils";
import { createOrUpdateCategory } from "@/lib/fetch";
import { toast } from "sonner";

interface CategoryFormProps {
    category?: Category;
    onSuccess?: () => void;
    onSave?: (updatedCategory: Category) => void;

}

export default function CategoryForm({ category, onSuccess, onSave }: CategoryFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCustomIcon, setIsCustomIcon] = useState(
        typeof category?.icon === "string" &&
        !defaultCategories.find((cat) => cat.icon === category.icon)
    );

    const form = useForm<InsertCategory>({
        resolver: zodResolver(insertCategorySchema),
        defaultValues: {
            id: category?.id || "",
            name: category?.name || "",
            icon: category?.icon || "",
            color: category?.color || CATEGORY_COLORS[0],
            type: category?.type || "expense",
        },
    });


    const icons = useMemo(() => {
        const uniqueIcons = new Set<string>();
        return defaultCategories
            .filter((cat) => {
                if (typeof cat.icon === "string" && uniqueIcons.has(cat.icon)) return false;
                if (typeof cat.icon === "string") uniqueIcons.add(cat.icon);
                return true;
            })
            .map((cat) => ({
                id: cat.id,
                icon: cat.icon,
                label: cat.name,
            }));
    }, []);

    const onSubmit = async (data: InsertCategory) => {
        setIsSubmitting(true);
        try {
            const saved = await createOrUpdateCategory({ ...data, }); // handle both create and update
            toast.success(category ? "Category updated!" : "Category created!");
            form.reset();
            onSave?.(saved); // pass the new/updated category back
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* Name */}
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

                {/* Type */}
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

                {/* Icon */}
                <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => {
                        const IconPreview = getLucideIcon(field.value);
                        const isValidIcon = !!IconPreview;

                        return (
                            <FormItem>
                                <FormLabel>Icon</FormLabel>
                                <FormControl>
                                    <div className="space-y-2">
                                        {!isCustomIcon ? (
                                            <>
                                                <Select
                                                    onValueChange={(val) => {
                                                        setIsCustomIcon(false);
                                                        field.onChange(val);
                                                    }}
                                                    defaultValue={String(field.value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select icon" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {icons.map(({ id, icon, label }) => {
                                                            const IconComponent = getLucideIcon(icon)
                                                            return (
                                                                <SelectItem
                                                                    key={id}
                                                                    value={typeof icon === "string" ? icon : id}
                                                                >
                                                                    <div className="flex items-center space-x-2">
                                                                        {IconComponent && (
                                                                            <span className="text-muted-foreground">
                                                                                {React.createElement(IconComponent)}
                                                                            </span>
                                                                        )}
                                                                        <span>{label}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setIsCustomIcon(true);
                                                        form.setValue("icon", "");
                                                    }}
                                                >
                                                    Or enter custom icon name
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between gap-4">
                                                    <Input
                                                        placeholder="Enter Lucide icon name (e.g. 'Wallet')"
                                                        value={String(field.value)}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    />

                                                    {/* 🔍 Live Preview */}
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 flex items-center justify-center rounded-md border bg-muted">
                                                            {isValidIcon ? (
                                                                React.createElement(IconPreview)
                                                            ) : (
                                                                <span className="text-sm text-muted-foreground">?</span>
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {isValidIcon
                                                                ? "Preview"
                                                                : `Unknown icon: "${field.value || "?"}"`}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setIsCustomIcon(false)}
                                                >
                                                    Back to icon list
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />


                {/* Color Picker */}
                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORY_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`w-8 h-8 rounded-full border-2 transition hover:brightness-110 hover:scale-105 ${field.value === color ? "border-gray-900 scale-110" : "border-transparent"
                                                }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => field.onChange(color)}
                                            aria-label={`Select color ${color}`}
                                        />
                                    ))}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => onSuccess?.()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                        {isSubmitting
                            ? "Saving..."
                            : category
                                ? "Update Category"
                                : "Add Category"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
