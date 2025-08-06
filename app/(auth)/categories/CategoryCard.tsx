import React from 'react'
import { CategoryWithStats } from '@/lib/types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency, getLucideIcon } from '@/lib/utils'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import { Edit, EllipsisVertical, Trash } from 'lucide-react'

type Props = {
    category: CategoryWithStats
    handleEdit: (category: CategoryWithStats) => void
    handleDelete: (is: string) => void
}

const CategoryCard = ({ category, handleEdit, handleDelete }: Props) => {
    const Icon = getLucideIcon(category.icon);
    return (
        <Card>
            <CardContent>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${category.color}20` }}
                        >
                            <Icon />
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
                                <Edit />
                                Edit
                            </DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Trash />Delete
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
    )
}

export default CategoryCard