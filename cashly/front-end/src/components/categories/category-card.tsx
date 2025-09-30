'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { deleteCategory } from '@/lib/redux/slices/categoriesSlice';
import { Category } from '@/lib/types/category';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CATEGORY_ICONS } from '@/lib/constants';
import { Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';
import React from 'react';

interface CategoryCardProps {
    category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
    const dispatch = useAppDispatch();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await dispatch(deleteCategory(category.categoryId)).unwrap();
            toast.success('Category deleted successfully');
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    // Get icon component
    const iconConfig = CATEGORY_ICONS.find(i => i.name === category.iconName);
    const IconComponent = iconConfig ? Icons[iconConfig.icon as keyof typeof Icons] : Icons.Tag;

    return (
        <>
            <Card className="relative group hover:shadow-lg transition-all">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setDeleteDialogOpen(true)}
                >
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-lg"
                            style={{
                                backgroundColor: category.colorHex ? `${category.colorHex}20` : '#f3f4f6'
                            }}
                        >
                            {React.createElement(IconComponent as any, {
                                className: "h-6 w-6",
                                style: { color: category.colorHex || '#6b7280' }
                            })}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{category.categoryName}</p>
                            <p className="text-sm text-muted-foreground">
                                0 transactions
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                            {`Are you sure you want to delete "${category.categoryName}"? This action cannot be undone.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
