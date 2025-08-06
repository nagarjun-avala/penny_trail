import React from 'react'
import { CategoryWithStats } from '@/lib/types'
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { EllipsisVertical, Plus } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { formatCurrency } from '@/lib/utils'

type Props = {
    categories: CategoryWithStats[]
    handleEdit: (category: CategoryWithStats) => void
    handleDelete: (is: string) => void
    handleAdd: () => void
}

const CategoryList = ({ categories, handleEdit, handleDelete, handleAdd }: Props) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((category) => (
                <Card key={category.id}>
                    <CardContent>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${category.color}20` }}
                                >
                                    {typeof category.icon === "string" ? (
                                        category.icon
                                    ) : category.icon ? (
                                        React.createElement(category.icon, {
                                            className: "text-lg",
                                            style: { color: category.color }
                                        })
                                    ) : null}
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
                                        <i className="fas fa-edit mr-2"></i>
                                        Edit
                                    </DropdownMenuItem>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                <i className="fas fa-trash mr-2"></i>
                                                Delete
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
            ))}

            {/* NO categories Add new category */}
            {categories.length === 0 && (
                <div className="col-span-full">
                    <Card>
                        <CardContent className="p-12 text-center">
                            <i className="fas fa-tags text-slate-300 text-4xl mb-4"></i>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No categories found</h3>
                            <p className="text-slate-500 mb-4">Get started by creating your first category.</p>
                            <Button onClick={handleAdd}>
                                <Plus />Add Category
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default CategoryList