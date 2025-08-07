import React from 'react'
import { CategoryWithStats } from '@/lib/types'
import { Card, CardContent } from "@/components/ui/card"

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CategoryCard from './CategoryCard'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
    categories: CategoryWithStats[]
    loading: boolean
    handleEdit: (category: CategoryWithStats) => void
    handleDelete: (is: string) => void
    handleAdd: () => void
}

const CategoryList = ({ categories, loading, handleEdit, handleDelete, handleAdd }: Props) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
                <>
                    {[1, 2, 3, 4, 5, 6].map(item => (
                        <Skeleton key={item} className="w-[350px] h-[200px] mb-1" />
                    ))}
                </>
            ) : (
                categories.map((category) => (
                    <CategoryCard key={category.id} category={category} handleDelete={handleDelete} handleEdit={handleEdit} />
                ))
            )}

            {/* NO categories Add new category */}
            {!loading && categories.length === 0 && (
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