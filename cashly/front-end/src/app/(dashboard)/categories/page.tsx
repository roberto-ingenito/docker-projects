'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchCategories } from '@/lib/redux/slices/categoriesSlice';
import { CategoryList } from '@/components/categories/category-list';
import { CreateCategoryDialog } from '@/components/categories/create-category-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CategoriesPage() {
    const dispatch = useAppDispatch();
    const { categories, isLoading } = useAppSelector((state) => state.categories);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">
                        Organize your transactions with categories
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>

            <CategoryList categories={categories} isLoading={isLoading} />

            <CreateCategoryDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
        </div>
    );
}